// Handles wishlist API calls.
import { API_ENDPOINTS } from "../constants/apiConfig.js";
import { apiRequest } from "../api/apiClient.js";

function normalize(product) {
  return { ...product, id: product._id || product.id, name: product.title || product.name, image: product.images?.[0]?.url || product.image || "", price: product.discountPrice || product.price || 0, mrp: product.price || product.mrp || 0, category: product.category?.name || product.category || "Oil", volume: product.volume || "1L" };
}

export async function fetchWishlist() {
  const data = await apiRequest(API_ENDPOINTS.wishlist);
  return (data.wishlist || []).map(normalize);
}

export async function addWishlist(productId) {
  const data = await apiRequest(API_ENDPOINTS.wishlist, { method: "POST", body: JSON.stringify({ productId }) });
  return (data.wishlist || []).map(normalize);
}

export async function removeWishlist(productId) {
  const data = await apiRequest(API_ENDPOINTS.wishlistItem(productId), { method: "DELETE" });
  return (data.wishlist || []).map(normalize);
}
