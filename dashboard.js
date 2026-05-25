'use strict';

(async function() {
  if (!getAuthToken()) return;
  try {
    const r = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${getAuthToken()}` } });
    if (!r.ok) return;
    const d = await r.json();
    document.getElementById('user-name').textContent = d.user.first_name || 'Пользователь';
  } catch(e) {}
  loadPlans();
})();

async function loadPlans() {
  const el = document.getElementById('tab-plans');
  try {
    const r = await fetch('/api/vpn/plans');
    const d = await r.json();
    if (!d.plans || !d.plans.length) { el.innerHTML = '<p style="color:var(--text-secondary);">Нет доступных тарифов</p>'; return; }
    el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;">' +
      d.plans.map(p => `
        <div class="plan-card" style="background:var(--bg-card);border-radius:var(--radius-md);padding:24px;border:1px solid var(--border);">
          <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:8px;">${p.name || 'Тариф'}</h3>
          <p style="font-size:2rem;font-weight:800;color:var(--accent);margin-bottom:4px;">$${p.price_usd || '0'}</p>
          <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:12px;">${p.days || 30} дней · ${p.devices || 1} устройств</p>
          <button class="btn btn-primary btn-block" onclick="buyPlan('${p.uuid}')">Купить</button>
        </div>
      `).join('') + '</div>';
  } catch(e) { el.innerHTML = '<p style="color:var(--danger);">Ошибка загрузки тарифов</p>'; }
}

async function buyPlan(planUuid) {
  const user = getCurrentUser();
  if (!user) return;
  try {
    const r = await fetch('/api/vpn/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_uuid: planUuid, external_user_id: user.telegram_id || user.email })
    });
    const d = await r.json();
    if (d.success !== false) { alert('✅ Подписка создана!'); loadSubscriptions(); }
    else { alert('❌ Ошибка: ' + (d.error || 'неизвестно')); }
  } catch(e) { alert('❌ Ошибка: ' + e.message); }
}

async function loadSubscriptions() {
  const el = document.getElementById('tab-subscriptions');
  el.innerHTML = '<p style="color:var(--text-secondary);">У вас пока нет активных подписок</p>';
}

async function loadDevices() {
  const el = document.getElementById('tab-devices');
  el.innerHTML = '<p style="color:var(--text-secondary);">Нет подключённых устройств</p>';
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => {
    const isActive = (tab === 'plans' && t.textContent.includes('Тарифы')) ||
                     (tab === 'subscriptions' && t.textContent.includes('Подписки')) ||
                     (tab === 'devices' && t.textContent.includes('Устройства'));
    t.classList.toggle('active', isActive);
    t.style.borderBottom = isActive ? '2px solid var(--accent)' : '2px solid transparent';
    t.style.color = isActive ? 'var(--text-primary)' : 'var(--text-secondary)';
  });
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
  if (tab === 'subscriptions') loadSubscriptions();
  if (tab === 'devices') loadDevices();
}

window.switchTab = switchTab;
window.buyPlan = buyPlan;
