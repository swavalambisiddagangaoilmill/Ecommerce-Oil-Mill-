// Storefront promotion APIs for active offers and coupon validation.
import { apiRequest } from "../api/apiClient.js";
import { API_ENDPOINTS } from "../constants/apiConfig.js";

export function getActiveOffers() {
  return apiRequest(API_ENDPOINTS.offers).then((data) => data.offers || []);
}

export function validateCoupon(code, products) {
  return apiRequest(API_ENDPOINTS.couponValidate, { method: "POST", body: JSON.stringify({ code, products }) }).then((data) => data.coupon);
}
