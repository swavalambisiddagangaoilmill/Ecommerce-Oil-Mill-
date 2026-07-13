// Upload service prepared for Cloudinary integration.
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";

export async function uploadImage(file) {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return {
      url: `/uploads/${file.originalname}`,
      publicId: null,
      provider: "local",
      message: "Cloudinary credentials are not configured; file metadata was accepted locally.",
    };
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "velora/products", resource_type: "image" });
  return { url: result.secure_url, publicId: result.public_id, provider: "cloudinary" };
}

export async function deleteImage(publicId) {
  if (!publicId) return { deleted: false };
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return { deleted: true, provider: "local" };
  }
  const result = await cloudinary.uploader.destroy(publicId);
  return { deleted: result.result === "ok", provider: "cloudinary", result };
}
