// Keeps order submission isolated from checkout UI.
import { API_ENDPOINTS } from "../config/apiConfig.js";
import { apiRequest } from "./apiClient.js";

export async function createOrder(payload) {
  // Backend: POST cart, customer, shipping, and payment intent data here.
  return apiRequest(API_ENDPOINTS.orders, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
