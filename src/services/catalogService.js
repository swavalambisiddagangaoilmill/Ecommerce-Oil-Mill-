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

export function getRelatedProducts(currentProduct, limit = 3) {
  return products.filter((product) => product.category === currentProduct.category && product.id !== currentProduct.id).slice(0, limit);
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
