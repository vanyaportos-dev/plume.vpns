const redis = require('../../lib/redis');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const auth = req.headers.authorization;
    let token = null;
    if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
    if (!token) {
      const cookies = req.headers.cookie || '';
      const match = cookies.match(/plume_token=([^;]+)/);
      if (match) token = match[1];
    }
    if (!token) return res.status(401).json({ error: 'Не авторизован' });

    const session = JSON.parse(await redis.get(`session:${token}`) || 'null');
    if (!session || session.expires_at < Date.now()) {
      return res.status(401).json({ error: 'Сессия истекла' });
    }

    const userId = session.telegram_id || session.email;
    let user = JSON.parse(await redis.get(`user:${userId}`) || 'null');
    if (!user) user = JSON.parse(await redis.get(`user:tg:${userId}`) || 'null');
    if (!user) return res.status(401).json({ error: 'Пользователь не найден' });

    return res.json({ user: { telegram_id: user.telegram_id, first_name: user.first_name, username: user.username, role: user.role } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
