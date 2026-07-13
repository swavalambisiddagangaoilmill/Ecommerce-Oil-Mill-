// Documents frontend security headers enforced by hosting/backend.
export const securityHeadersAwareness = {
  csrf: "Mutating requests should include a server-issued CSRF token when cookie auth is used.",
  csp: "Configure Content-Security-Policy at the hosting layer.",
  hsts: "Configure Strict-Transport-Security on HTTPS responses.",
  frameOptions: "Configure X-Frame-Options or frame-ancestors in CSP.",
  contentTypeOptions: "Configure X-Content-Type-Options: nosniff.",
  referrerPolicy: "Configure Referrer-Policy for outbound navigation privacy.",
};
