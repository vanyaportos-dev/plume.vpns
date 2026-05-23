const { deleteDevice } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription_uuid, device_id } = req.body;

    if (!subscription_uuid || !device_id) {
      return res.status(400).json({ error: 'subscription_uuid и device_id обязательны' });
    }

    const result = await deleteDevice(subscription_uuid, device_id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/vpn/devices-delete] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
