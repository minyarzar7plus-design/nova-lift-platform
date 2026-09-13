const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const demo = {
  wallet: { balance: 2480.5, todayCommission: 42.8, totalCommission: 864.2 },
  tasks: [1,2,3].map((id) => ({ id, name: ['Product discovery','Market feedback','Quality check'][id-1], description: 'Complete a quality review for the marketplace.', amount: id*18, commission: id*2.7, requiredLevel: id, isActive: true })),
  referrals: { totalReferrals: 12, activeReferrals: 8, totalCommission: 186.4 },
};
export async function request(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nova_token') : null;
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`API ${response.status}`);
    return response.status === 204 ? null : response.json();
  } catch (error) { if (options.allowDemo === false) throw error; return null; }
}
const get = (path, fallback = []) => request(path).then((value) => value ?? fallback);
export const apiBase = API_BASE;
export const getWallet = () => get('/api/wallet', demo.wallet);
export const getTasks = () => get('/api/tasks', demo.tasks);
export const getTaskOrders = (query = '') => get(`/api/task-orders${query}`);
export const getTransactions = () => get('/api/wallet/transactions');
export const getReferrals = () => get('/api/referrals', demo.referrals);
export const getCommissions = () => get('/api/referrals/commissions');
export const getPaymentMethods = () => get('/api/payment-methods');
export const getDeposits = () => get('/api/deposits');
export const getWithdrawals = () => get('/api/withdrawals');
export const getNotifications = () => get('/api/notifications');
export const getSupport = () => get('/api/support');
export const getLanguages = () => get('/api/languages');
export const startTask = (id) => request(`/api/task-orders/${id}/start`, { method: 'POST', allowDemo: false });
export const completeTask = (id) => request(`/api/task-orders/${id}/complete`, { method: 'POST', allowDemo: false });
export const createDeposit = (body) => request('/api/deposits', { method: 'POST', body: JSON.stringify(body), allowDemo: false });
export const createWithdrawal = (body) => request('/api/withdrawals', { method: 'POST', body: JSON.stringify(body), allowDemo: false });
export const updateProfile = (body) => request('/api/user/profile', { method: 'PUT', body: JSON.stringify(body), allowDemo: false });
export const updateLanguage = (language) => request('/api/user/language', { method: 'PUT', body: JSON.stringify({ language }), allowDemo: false });
export const markNotificationRead = (id) => request(`/api/notifications/${id}/read`, { method: 'PUT', allowDemo: false });
export const createSupport = (body) => request('/api/support', { method: 'POST', body: JSON.stringify(body), allowDemo: false });
export default request;
export { demo }; 
