// Wraps HTTP requests so backend details stay out of UI components.
import { API_BASE_URL } from "../constants/apiConfig.js";

const TOKEN_KEY = "velora_token";
const REFRESH_KEY = "velora_refresh_token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthTokens(token, refreshToken) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const hasBody = options.body instanceof FormData;
  const headers = { ...(hasBody ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { credentials: "include", ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.message || (response.status === 429 ? "Rate limit reached. Please retry after a short pause." : `API request failed: ${response.status}`);
    throw new Error(message);
  }
  return payload.data ?? payload;
}
