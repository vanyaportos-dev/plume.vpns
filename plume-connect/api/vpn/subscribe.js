const { createSubscription } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan_uuid, external_user_id } = req.body;

    if (!plan_uuid || !external_user_id) {
      return res.status(400).json({ error: 'plan_uuid и external_user_id обязательны' });
    }

    const result = await createSubscription(plan_uuid, external_user_id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/vpn/subscribe] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
