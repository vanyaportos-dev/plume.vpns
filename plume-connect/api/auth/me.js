const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    const token = auth.split(' ')[1];
    const session = JSON.parse(await redis.get(`session:${token}`) || 'null');
    if (!session || session.expires_at < Date.now()) {
      return res.status(401).json({ error: 'Сессия истекла' });
    }
    const user = JSON.parse(await redis.get(`user:${session.email}`) || 'null');
    if (!user) return res.status(401).json({ error: 'Пользователь не найден' });
    return res.status(200).json({ user: { email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};