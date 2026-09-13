const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const demo = { wallet:{balance:2480.5,totalCommission:864.2,todayCommission:42.8,frozen:0}, tasks:[{id:1,name:'Product discovery',description:'Review a product listing and confirm the details.',amount:18,commission:2.7,requiredLevel:1,dailyLimit:10,isActive:true},{id:2,name:'Market feedback',description:'Share a quick opinion to help improve a marketplace.',amount:32,commission:4.8,requiredLevel:2,dailyLimit:8,isActive:true},{id:3,name:'Quality check',description:'Check the accuracy of a digital product page.',amount:48,commission:7.2,requiredLevel:3,dailyLimit:5,isActive:true}],referrals:{totalReferrals:12,activeReferrals:8,totalCommission:186.4,referrals:[]}};
async function request(path, options={}) { const token=typeof window!=='undefined'?window.localStorage.getItem('nova_token'):null; try { const response=await fetch(`${API_BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}}); if(!response.ok) throw new Error(`Request failed (${response.status})`); return response.status===204?null:response.json(); } catch(error) { if(options.allowDemo===false) throw error; return null; } }
export const getWallet=async()=>await request('/api/wallet')||demo.wallet;
export const getTasks=async()=>await request('/api/tasks')||demo.tasks;
export const getTaskOrders=async()=>await request('/api/task-orders')||[];
export const getReferrals=async()=>await request('/api/referrals')||demo.referrals;
export const getTransactions=async()=>await request('/api/wallet/transactions')||[];
export const createWithdrawal=(payload)=>request('/api/withdrawals',{method:'POST',body:JSON.stringify(payload),allowDemo:false});
export const startTask=(id)=>request(`/api/task-orders/${id}/start`,{method:'POST',allowDemo:false});
export const completeTask=(id)=>request(`/api/task-orders/${id}/complete`,{method:'POST',allowDemo:false});
export {demo};
export default request;
