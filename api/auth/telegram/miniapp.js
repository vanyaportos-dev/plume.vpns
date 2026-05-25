const crypto = require('crypto');
const redis = require('../../../lib/redis');
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8665223726:AAE_2OfW2_a32-j9n6MrU3S2j8r212LSzV4';

function verifyMiniAppData(initData) {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');
  const checkString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
  return hmac === hash;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const chunks = []; for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf-8');
    const body = JSON.parse(raw);
    const { initData } = body;
    if (!initData) return res.status(400).json({ error: 'initData required' });
    if (!verifyMiniAppData(initData)) return res.status(401).json({ error: 'Invalid signature' });

    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return res.status(400).json({ error: 'User data missing' });
    const userData = JSON.parse(userStr);
    const { id, first_name, last_name, username, photo_url } = userData;

    let user = JSON.parse(await redis.get(`user:tg:${id}`) || 'null');
    if (!user) {
      user = { telegram_id: id, first_name, last_name: last_name || '', username: username || '', photo_url: photo_url || '', role: 'user', created_at: new Date().toISOString() };
      await redis.set(`user:tg:${id}`, JSON.stringify(user));
      await redis.sadd('users:all', `tg:${id}`);
      const admin = JSON.parse(await redis.get('admin:settings') || 'null');
      if (!admin) { await redis.set('admin:settings', JSON.stringify({ admin_ids: [id.toString()] })); user.role = 'admin'; await redis.set(`user:tg:${id}`, JSON.stringify(user)); }
    }

    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`session:${token}`, JSON.stringify({ telegram_id: id.toString(), auth_method: 'telegram', expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
    return res.json({ token, user: { telegram_id: user.telegram_id, first_name: user.first_name, username: user.username, role: user.role } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
