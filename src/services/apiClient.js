// Wraps HTTP requests so backend details stay out of UI components.
import { API_BASE_URL } from "../config/apiConfig.js";

export async function apiRequest(endpoint, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL. Configure it when backend APIs are ready.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    // Backend integration required here: attach CSRF token and auth headers for protected requests.
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit reached. Please retry after a short pause.");
    }
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
