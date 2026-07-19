// Sends authentication emails through a replaceable adapter.
import { env } from "../config/env.js";

async function sendMail({ to, subject, text }) {
  if (!env.isProduction) {
    console.log(`[auth-email] ${subject} -> ${to}\n${text}`);
    return true;
  }
  console.warn("Email adapter not configured. Set SMTP provider before production email delivery.");
  return false;
}

export function sendVerificationEmail(user, token) {
  const url = `${env.clientUrl}/auth/verify-email/${token}`;
  return sendMail({ to: user.email, subject: "Verify your Velora account", text: `Verify your email: ${url}` });
}

export function sendPasswordResetEmail(user, token) {
  const url = `${env.clientUrl}/auth/reset-password/${token}`;
  return sendMail({ to: user.email, subject: "Reset your Velora password", text: `Reset your password: ${url}` });
}

export function sendOtpEmail(user, code, purpose) {
  return sendMail({ to: user.email, subject: "Velora security code", text: `Your ${purpose} code is ${code}. It expires shortly.` });
}

export function sendNewDeviceEmail(user, details) {
  return sendMail({ to: user.email, subject: "New Velora login detected", text: `New login detected from ${details.browser || "Unknown browser"} on ${details.os || "Unknown OS"}.` });
}
