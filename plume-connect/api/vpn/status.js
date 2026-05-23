const { getSubscriptionStatus } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription_uuid } = req.query;

    if (!subscription_uuid) {
      return res.status(400).json({ error: 'subscription_uuid обязателен' });
    }

    const result = await getSubscriptionStatus(subscription_uuid);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/vpn/status] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
