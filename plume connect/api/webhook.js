module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    console.log('📡 Webhook:', body.event, body.data?.subscription_uuid);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
