/* ============================================================
   PLUME CONNECT — app.js
   Общие функции + Telegram Mini App авто-вход
   ============================================================ */

'use strict';

const AUTH_TOKEN_KEY = 'plume_token';
const AUTH_USER_KEY  = 'plume_user';

/* ── Telegram Mini App — Авто-вход ──────────────────────────── */
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

        // Редирект на дашборд, если на главной или логине
        const path = window.location.pathname;
        if (path === '/' || path === '/login' || path === '/register') {
          window.location.href = '/dashboard';
        }
      }
    } catch (e) {
      console.error('Mini App auth error:', e);
    }
  })();
}

/* ── Sticky Navbar ──────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
});

/* ── FAQ Accordion ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
});

/* ── Mobile Menu ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
});
