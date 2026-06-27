// Documents frontend security headers that must be enforced by hosting/backend.
export const securityHeadersAwareness = {
  csrf: "Backend integration required here: issue CSRF token and send it with mutating requests.",
  csp: "Configure Content-Security-Policy at the hosting layer.",
  hsts: "Configure Strict-Transport-Security on HTTPS responses.",
  frameOptions: "Configure X-Frame-Options or frame-ancestors in CSP.",
  contentTypeOptions: "Configure X-Content-Type-Options: nosniff.",
  referrerPolicy: "Configure Referrer-Policy for outbound navigation privacy.",
};
