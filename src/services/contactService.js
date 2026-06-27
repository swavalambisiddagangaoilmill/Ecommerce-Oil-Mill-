// Keeps contact and newsletter submissions isolated from forms.
import { API_ENDPOINTS } from "../config/apiConfig.js";
import { apiRequest } from "./apiClient.js";

export async function submitContactMessage(payload) {
  // Backend: POST contact form payload to the support endpoint here.
  return apiRequest(API_ENDPOINTS.contact, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function subscribeToNewsletter(payload) {
  // Backend: POST newsletter email payload here.
  return apiRequest(API_ENDPOINTS.newsletter, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
