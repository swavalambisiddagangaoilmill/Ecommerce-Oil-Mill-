// Centralizes environment-aware CORS and CSP origin rules.
import { env } from "./env.js";

const DEV_TUNNEL_HOSTS = [
  ".devtunnels.ms",
  ".ngrok-free.app",
  ".ngrok.io",
  ".trycloudflare.com",
];

const DEV_CSP_CONNECT_SOURCES = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  "https://localhost:*",
  "https://127.0.0.1:*",
  "https://*.devtunnels.ms",
  "https://*.ngrok-free.app",
  "https://*.ngrok.io",
  "https://*.trycloudflare.com",
];

function parseOrigin(origin) {
  try {
    return new URL(origin);
  } catch {
    return null;
  }
}

function isLocalDevelopmentOrigin(url) {
  return ["localhost", "127.0.0.1"].includes(url.hostname);
}

function isApprovedTunnelOrigin(url) {
  return url.protocol === "https:" && DEV_TUNNEL_HOSTS.some((host) => url.hostname === host.slice(1) || url.hostname.endsWith(host));
}

export function isAllowedCorsOrigin(origin) {
  if (!origin) return true;
  if (env.clientUrls.includes(origin)) return true;
  if (env.isProduction) return false;

  const url = parseOrigin(origin);
  if (!url) return false;
  return isLocalDevelopmentOrigin(url) || isApprovedTunnelOrigin(url);
}

export function corsOrigin(origin, callback) {
  if (isAllowedCorsOrigin(origin)) return callback(null, true);
  return callback(new Error("CORS origin blocked."));
}

export function cspConnectSources() {
  return env.isProduction ? env.clientUrls : [...env.clientUrls, ...DEV_CSP_CONNECT_SOURCES];
}