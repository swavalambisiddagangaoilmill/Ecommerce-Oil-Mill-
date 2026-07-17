// Centralizes API configuration for backend communication.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    continueAdminLogin: "/auth/admin-login/continue",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forgot-password",
    resetPassword: (token) => `/auth/reset-password/${token}`,
    verifyEmail: (token) => `/auth/verify-email/${token}`,
    addresses: "/auth/addresses",
    address: (id) => `/auth/addresses/${id}`,
  },
  products: "/products",
  featuredProducts: "/products/featured",
  product: (slug) => `/products/${slug}`,
  relatedProducts: (id, limit = 6) => `/products/${id}/related?limit=${limit}`,
  categories: "/categories",
  cart: "/cart",
  cartSync: "/cart/sync",
  cartItems: "/cart/items",
  cartItem: (id) => `/cart/items/${id}`,
  wishlist: "/wishlist",
  wishlistItem: (id) => `/wishlist/${id}`,
  orders: "/orders",
  myOrders: "/orders/my",
  order: (id) => `/orders/${id}`,
  orderTracking: (id) => `/orders/${id}/tracking`,
  adminAdvanceMockShipment: (id) => `/admin/orders/${id}/mock-shipment/next`,
  paymentIntent: "/payments/intent",
  paymentVerify: "/payments/verify",
  paymentUpiQr: "/payments/upi-qr",
  paymentUpiQrStatus: (id) => `/payments/upi-qr/${id}`,
  contact: "/contact",
  newsletter: "/newsletter",
  faqs: "/content/faqs",
  pageContent: (slug) => `/content/pages/${slug}`,
};





