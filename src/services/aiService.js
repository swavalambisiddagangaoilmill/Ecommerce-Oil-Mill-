// Handles assistant chat requests.
import { apiRequest } from "../api/apiClient.js";

export function askAssistant(message) {
  return apiRequest("/ai/chat", { method: "POST", body: JSON.stringify({ message }) });
}
