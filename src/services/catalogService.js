// Serves product catalog data and marks where catalog APIs should connect.
import { API_ENDPOINTS } from "../config/apiConfig.js";
import {
  bestSellerProducts,
  categories,
  everydayEssentials,
  products,
} from "../data/products.js";
import { apiRequest } from "./apiClient.js";

export function getProducts() {
  // Backend: replace with apiRequest(API_ENDPOINTS.products) when the catalog endpoint is ready.
  return products;
}

export function getCategories() {
  return categories;
}

export function getProductBySlug(slug) {
  // Backend: replace with apiRequest(API_ENDPOINTS.product(slug)) for live product details.
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(currentProduct, limit = 6) {
  const safeLimit = Math.min(Math.max(limit, 4), 8);
  const sameCategory = products.filter((product) => product.category === currentProduct.category && product.id !== currentProduct.id);
  const fallback = products.filter((product) => product.category !== currentProduct.category && product.id !== currentProduct.id);
  return [...sameCategory, ...fallback].slice(0, safeLimit);
}

export function getEverydayEssentials() {
  return everydayEssentials;
}

export function getBestSellerProducts() {
  return bestSellerProducts;
}

export async function fetchProductsFromBackend() {
  return apiRequest(API_ENDPOINTS.products);
}
