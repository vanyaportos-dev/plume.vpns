const API_BASE = 'https://network-api.adaptgroup.app';
const API_KEY = 'ADAPTF753KJUVRZ3VESULP45YBVFC2IVIMBWABI7T63WREXPZGS4R5PGAVPN';
const API_KEY_ID = 24;

async function apiCall(endpoint, body = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
    body: JSON.stringify({ api_key_id: API_KEY_ID, ...body })
  });
  if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.message || `HTTP ${response.status}`); }
  return await response.json();
}

async function getPlans() { const data = await apiCall('/plans/list'); return data.plans || []; }
async function createSubscription(planUuid, externalUserId) { return await apiCall('/subs/create', { plan_uuid: planUuid, external_user_id: externalUserId }); }
async function renewSubscription(subscriptionUuid) { return await apiCall('/subs/renew', { subscription_uuid: subscriptionUuid }); }
async function freezeSubscription(subscriptionUuid) { return await apiCall('/subs/freeze', { subscription_uuid: subscriptionUuid }); }
async function unfreezeSubscription(subscriptionUuid) { return await apiCall('/subs/unfreeze', { subscription_uuid: subscriptionUuid }); }
async function upgradeSubscription(subscriptionUuid, newPlanUuid) { return await apiCall('/subs/upgrade', { subscription_uuid: subscriptionUuid, new_plan_uuid: newPlanUuid }); }
async function purchaseTraffic(subscriptionUuid, gbAmount) { return await apiCall('/subs/traffic', { subscription_uuid: subscriptionUuid, gb_amount: gbAmount }); }
async function getSubscriptionStatus(subscriptionUuid) { return await apiCall('/subs/status', { subscription_uuid: subscriptionUuid }); }
async function getDevices(subscriptionUuid) { const data = await apiCall('/subs/devices', { subscription_uuid: subscriptionUuid }); return data.devices || []; }
async function getConnectionRequests(subscriptionUuid, offset = 0, limit = 20) { return await apiCall('/subs/requests', { subscription_uuid: subscriptionUuid, offset, limit }); }
async function deleteDevice(subscriptionUuid, deviceId) { return await apiCall('/subs/devices/delete', { subscription_uuid: subscriptionUuid, device_id: deviceId }); }
function getSubscriptionURL(subscriptionUuid) { return `${API_BASE}/sub/${subscriptionUuid}`; }

module.exports = { getPlans, createSubscription, renewSubscription, freezeSubscription, unfreezeSubscription, upgradeSubscription, purchaseTraffic, getSubscriptionStatus, getDevices, getConnectionRequests, deleteDevice, getSubscriptionURL };
