// Handles frontend authentication API calls.
import { API_ENDPOINTS } from "../constants/apiConfig.js";
import { apiRequest, clearAuthTokens, setAuthTokens } from "../api/apiClient.js";

export async function loginAccount(payload) {
  const data = await apiRequest(API_ENDPOINTS.auth.login, { method: "POST", body: JSON.stringify(payload) });
  setAuthTokens(data.token, data.refreshToken);
  return data;
}

export async function registerAccount(payload) {
  const data = await apiRequest(API_ENDPOINTS.auth.register, { method: "POST", body: JSON.stringify(payload) });
  setAuthTokens(data.token, data.refreshToken);
  return data;
}

export async function logoutAccount() {
  try {
    await apiRequest(API_ENDPOINTS.auth.logout, { method: "POST" });
  } finally {
    clearAuthTokens();
  }
}

export function getProfile() {
  return apiRequest(API_ENDPOINTS.auth.profile);
}
