// Ensures the env-configured default admin exists during backend startup.
import User from "../models/User.js";

const DEFAULT_ADMIN_EMAIL = "swavalambisiddagangaoilmill@gmail.com";

export async function ensureDefaultAdmin() {
  const existing = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (existing) {
    console.log("Default admin already exists.");
    return existing;
  }

  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  if (!password) {
    console.warn("DEFAULT_ADMIN_PASSWORD is missing. Default admin was not created.");
    return null;
  }

  const admin = await User.create({
    name: "SS Oil Mill Admin",
    email: DEFAULT_ADMIN_EMAIL,
    password,
    role: "admin",
    adminRole: "OWNER",
    emailVerified: true,
    isDisabled: false,
    oauthProviders: [],
  });

  console.log("Default admin created successfully.");
  return admin;
}
