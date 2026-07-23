// Keeps contact submissions isolated from forms.
import { API_ENDPOINTS } from "../constants/apiConfig.js";
import { apiRequest } from "../api/apiClient.js";

export async function submitContactMessage(payload) {
  // Backend: POST contact form payload to the support endpoint here.
  return apiRequest(API_ENDPOINTS.contact, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
