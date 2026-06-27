// Provides required legal page copy until CMS/legal APIs are connected.
export const legalPages = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["Information we collect", "We collect only the information needed to process orders, support requests, account access, and newsletter subscriptions."],
      ["How it is used", "Customer details are used for order fulfillment, communication, fraud prevention, and service improvement."],
      ["Backend integration required here", "Connect this copy to your legal CMS or backend-managed policy endpoint before launch if policies change frequently."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      ["Use of storefront", "By using Velora, customers agree to provide accurate order and account information."],
      ["Product information", "Product availability, prices, delivery estimates, and offers may change based on backend inventory and promotions."],
      ["Backend integration required here", "Connect dynamic pricing, stock, and account terms to backend services before accepting live orders."],
    ],
  },
  shipping: {
    title: "Shipping Policy",
    sections: [
      ["Delivery estimate", "Orders are prepared for fresh batch delivery, typically within 2 to 5 business days after confirmation."],
      ["Shipping updates", "Customers should receive dispatch and tracking updates once the backend order system is connected."],
      ["Backend integration required here", "Connect courier rates, serviceability, tracking, and delivery ETA APIs here."],
    ],
  },
  refund: {
    title: "Refund & Cancellation Policy",
    sections: [
      ["Cancellations", "Orders may be cancelled before dispatch, subject to order status and payment confirmation."],
      ["Refunds", "Refunds for eligible cancellations or damaged shipments should be processed through the payment provider."],
      ["Backend integration required here", "Connect payment refund, cancellation, and support ticket endpoints here."],
    ],
  },
  cookies: {
    title: "Cookie Policy",
    sections: [
      ["Cookie usage", "Cookies may be used for session continuity, cart persistence, analytics, and consent preferences."],
      ["Customer control", "Customers can manage browser settings and consent choices where applicable."],
      ["Backend integration required here", "Connect consent storage and analytics preferences before enabling production tracking."],
    ],
  },
};
