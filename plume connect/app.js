'use strict';
const AUTH_TOKEN_KEY = 'plume_token';
const AUTH_USER_KEY = 'plume_user';

// TELEGRAM MINI APP — АВТО-ВХОД
if (window.Telegram && window.Telegram.WebApp) {
  (async function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    if (localStorage.getItem(AUTH_TOKEN_KEY)) return;
    try {
      const r = await fetch('/api/auth/telegram/miniapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: tg.initData })
      });
      const d = await r.json();
      if (d.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, d.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(d.user));
      }
    } catch (e) { console.error('Mini App auth error:', e); }
  })();
}

function getAuthToken() { return localStorage.getItem(AUTH_TOKEN_KEY); }
function getCurrentUser() { const u = localStorage.getItem(AUTH_USER_KEY); return u ? JSON.parse(u) : null; }
async function logout() {
  const token = getAuthToken();
  if (token) { try { await fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); } catch(e) {} }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.location.href = 'https://t.me/plumecrobot';
}
window.logout = logout;
