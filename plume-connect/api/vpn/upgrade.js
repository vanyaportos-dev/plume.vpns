const { upgradeSubscription } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription_uuid, new_plan_uuid } = req.body;

    if (!subscription_uuid || !new_plan_uuid) {
      return res.status(400).json({ error: 'subscription_uuid и new_plan_uuid обязательны' });
    }

    const result = await upgradeSubscription(subscription_uuid, new_plan_uuid);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/vpn/upgrade] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
