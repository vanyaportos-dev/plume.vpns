const { purchaseTraffic } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription_uuid, gb_amount } = req.body;

    if (!subscription_uuid || !gb_amount) {
      return res.status(400).json({ error: 'subscription_uuid и gb_amount обязательны' });
    }

    const gbNumber = Number(gb_amount);
    if (isNaN(gbNumber) || gbNumber <= 0) {
      return res.status(400).json({ error: 'gb_amount должен быть положительным числом' });
    }

    const result = await purchaseTraffic(subscription_uuid, gbNumber);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/vpn/traffic] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
