// Admin API service layer using the existing shared API client.
import { apiRequest } from "../../api/apiClient.js";

const base = "/admin-panel";
const authBase = "/admin/auth";
export const adminAuthApi = {
  login: (payload) => apiRequest(`${authBase}/login`, { method: "POST", body: JSON.stringify(payload) }),
  profile: () => apiRequest(`${authBase}/profile`),
  logout: () => apiRequest(`${authBase}/logout`, { method: "POST" }),
};

export const adminApi = {
  search: (q) => apiRequest(`${base}/search?q=${encodeURIComponent(q)}`),
  dashboard: () => apiRequest(`${base}/dashboard`),
  orders: (query = "") => apiRequest(`${base}/orders${query}`),
  orderStatus: (id, status) => apiRequest(`${base}/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  readyToShip: (id) => apiRequest(`${base}/orders/${id}/ready-to-ship`, { method: "POST" }),
  mockNext: (id) => apiRequest(`${base}/orders/${id}/mock-shipment/next`, { method: "POST" }),
  products: (query = "") => apiRequest(`${base}/products${query}`),
  saveProduct: (payload, id) => apiRequest(id ? `${base}/products/${id}` : `${base}/products`, { method: id ? "PUT" : "POST", body: JSON.stringify(payload) }),
  archiveProduct: (id) => apiRequest(`${base}/products/${id}`, { method: "DELETE" }),
  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return apiRequest("/upload/image", { method: "POST", body: form });
  },
  bulkPreview: (payload) => apiRequest(`${base}/products/bulk-price/preview`, { method: "POST", body: JSON.stringify(payload) }),
  bulkApply: (payload) => apiRequest(`${base}/products/bulk-price/apply`, { method: "POST", body: JSON.stringify(payload) }),
  inventory: (id, payload) => apiRequest(`${base}/inventory/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  categories: () => apiRequest(`${base}/categories`),
  saveCategory: (payload, id) => apiRequest(id ? `${base}/categories/${id}` : `${base}/categories`, { method: id ? "PUT" : "POST", body: JSON.stringify(payload) }),
  offers: () => apiRequest(`${base}/offers`),
  createOffer: (payload) => apiRequest(`${base}/offers`, { method: "POST", body: JSON.stringify(payload) }),
  updateOffer: (id, payload) => apiRequest(`${base}/offers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  coupons: () => apiRequest(`${base}/coupons`),
  createCoupon: (payload) => apiRequest(`${base}/coupons`, { method: "POST", body: JSON.stringify(payload) }),
  updateCoupon: (id, payload) => apiRequest(`${base}/coupons/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  shipping: () => apiRequest(`${base}/shipping`),
  customers: () => apiRequest(`${base}/customers`),
  payments: () => apiRequest(`${base}/payments`),
  content: () => apiRequest(`${base}/content`),
  saveContent: (key, value) => apiRequest(`${base}/content/${encodeURIComponent(key)}`, { method: "PUT", body: JSON.stringify({ value }) }),
  messages: () => apiRequest(`${base}/messages`),
  messageStatus: (id, status) => apiRequest(`${base}/messages/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
  newsletter: () => apiRequest(`${base}/newsletter`),
  unsubscribe: (id) => apiRequest(`${base}/newsletter/${id}`, { method: "DELETE" }),
  reports: (type = "sales") => apiRequest(`${base}/reports?type=${type}`),
  users: () => apiRequest(`${base}/users`),
  updateUser: (id, adminRole) => apiRequest(`${base}/users/${id}`, { method: "PUT", body: JSON.stringify({ adminRole }) }),
  auditLogs: () => apiRequest(`${base}/audit-logs`),
  settings: () => apiRequest(`${base}/settings`),
  saveSettings: (payload) => apiRequest(`${base}/settings`, { method: "PUT", body: JSON.stringify(payload) }),
};


