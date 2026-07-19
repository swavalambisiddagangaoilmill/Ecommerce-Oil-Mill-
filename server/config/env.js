// Loads and normalizes environment configuration.
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/velora_ecommerce",
  jwtSecret: process.env.JWT_SECRET || "development_only_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173").split(",").map((url) => url.trim()).filter(Boolean),
  oauth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  },
  turnstile: {
    secretKey: process.env.TURNSTILE_SECRET_KEY || "",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME || "",
    apiKey: process.env.CLOUDINARY_KEY || "",
    apiSecret: process.env.CLOUDINARY_SECRET || "",
  },
  shiprocket: {
    mock: !isProduction && process.env.SHIPROCKET_MOCK === "true",
    email: process.env.SHIPROCKET_EMAIL || "",
    password: process.env.SHIPROCKET_PASSWORD || "",
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "",
    pickupPostcode: process.env.SHIPROCKET_PICKUP_POSTCODE || "",
    webhookSecret: process.env.SHIPROCKET_WEBHOOK_SECRET || "",
    defaultWeightKg: Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG) || 0,
    defaultLengthCm: Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM) || 0,
    defaultBreadthCm: Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM) || 0,
    defaultHeightCm: Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM) || 0,
  },
};

if (isProduction && (env.jwtSecret === "development_only_change_me" || env.jwtSecret.length < 32)) {
  throw new Error("JWT_SECRET must be a strong secret in production.");
}

if (isProduction && process.env.SHIPROCKET_MOCK === "true") {
  throw new Error("SHIPROCKET_MOCK cannot be enabled in production.");
}


