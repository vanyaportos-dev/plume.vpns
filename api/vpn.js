const { getPlans, createSubscription, renewSubscription, freezeSubscription, unfreezeSubscription, upgradeSubscription, purchaseTraffic, getSubscriptionStatus, getDevices, getConnectionRequests, deleteDevice } = require('../lib/adaptgroup.js');

module.exports = async function handler(req, res) {
  const url = new URL(req.url);
  const pathname = url.pathname.replace('/api/vpn', '');

  try {
    if (req.method === 'GET' && pathname === '/plans') {
      const plans = await getPlans();
      return res.json({ success: true, plans });
    }

    if (req.method === 'POST' && pathname === '/subscribe') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await createSubscription(body.plan_uuid, body.external_user_id);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'POST' && pathname === '/renew') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await renewSubscription(body.uuid);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'POST' && pathname === '/freeze') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await freezeSubscription(body.uuid);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'POST' && pathname === '/unfreeze') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await unfreezeSubscription(body.uuid);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'POST' && pathname === '/upgrade') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await upgradeSubscription(body.uuid, body.new_plan_uuid);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'POST' && pathname === '/traffic') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await purchaseTraffic(body.uuid, body.gb);
      return res.json({ success: true, ...result });
    }

    if (req.method === 'GET' && pathname === '/status') {
      const uuid = url.searchParams.get('uuid');
      if (!uuid) return res.status(400).json({ error: 'uuid required' });
      const status = await getSubscriptionStatus(uuid);
      return res.json({ success: true, ...status });
    }

    if (req.method === 'GET' && pathname === '/devices') {
      const uuid = url.searchParams.get('uuid');
      if (!uuid) return res.status(400).json({ error: 'uuid required' });
      const devices = await getDevices(uuid);
      return res.json({ success: true, devices });
    }

    if (req.method === 'POST' && pathname === '/devices-delete') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const result = await deleteDevice(body.uuid, body.device_id);
      return res.json({ success: true, ...result });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
