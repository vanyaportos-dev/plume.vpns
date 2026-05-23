/* ============================================================
   PLUME CONNECT — app.js
   Общие функции + навигация
   ============================================================ */

'use strict';

/* ── Навигация: sticky + burger ─────────────────────────────── */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const burger  = document.querySelector('.navbar-burger');
  const mobileMenu = document.querySelector('.navbar-mobile');
  const mobileClose = document.querySelector('.navbar-mobile-close');

  if (!navbar) return;

  // Sticky scroll class
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Burger toggle
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ── FAQ аккордеон ──────────────────────────────────────────── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Закрыть все
      items.forEach(i => i.classList.remove('open'));

      // Открыть текущий если был закрыт
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

/* ── Scroll reveal ───────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Smooth scroll для якорей ───────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Утилиты ─────────────────────────────────────────────────── */

/**
 * Показать кратковременное уведомление.
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.plume-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `plume-toast plume-toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  const style = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 12px;
    font-family: var(--font);
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: toastIn 0.3s ease both;
    max-width: 340px;
    ${type === 'success'
      ? 'background: rgba(0,214,143,0.12); border: 1px solid rgba(0,214,143,0.3); color: #00d68f;'
      : 'background: rgba(255,68,68,0.12); border: 1px solid rgba(255,68,68,0.3); color: #ff6b6b;'}
  `;

  toast.setAttribute('style', style);

  if (!document.querySelector('#toast-keyframes')) {
    const s = document.createElement('style');
    s.id = 'toast-keyframes';
    s.textContent = `@keyframes toastIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }`;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

/**
 * Экранирование HTML.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Форматировать дату.
 */
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric'
  });
}

// Экспорт для использования в других скриптах
window.PlumeApp = { showToast, escapeHtml, formatDate };
