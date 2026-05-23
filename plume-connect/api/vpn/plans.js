const { getPlans } = require('../adaptgroup.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const plans = await getPlans();
    return res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error('[/api/vpn/plans] Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
