// Centralizes API configuration for future backend wiring.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const API_ENDPOINTS = {
  products: "/products",
  product: (slug) => `/products/${slug}`,
  orders: "/orders",
  contact: "/contact",
  newsletter: "/newsletter",
  faqs: "/content/faqs",
};
