// Upload service prepared for Cloudinary integration.
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function hasValidImageSignature(file) {
  const buffer = file.buffer;
  if (!buffer || buffer.length < 12) return false;
  const hex = buffer.subarray(0, 12).toString("hex");
  const ascii = buffer.subarray(0, 12).toString("ascii");
  return (
    hex.startsWith("ffd8ff") ||
    hex.startsWith("89504e470d0a1a0a") ||
    ascii.startsWith("GIF87a") ||
    ascii.startsWith("GIF89a") ||
    (ascii.startsWith("RIFF") && buffer.subarray(8, 12).toString("ascii") === "WEBP")
  );
}

export async function uploadImage(file) {
  if (!hasValidImageSignature(file)) throw new ApiError("Uploaded file is not a valid image.", 400);
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    return {
      url: `/uploads/${file.originalname}`,
      publicId: null,
      provider: "local",
      message: "Cloudinary credentials are not configured; file metadata was accepted locally.",
    };
  }

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: "ss-oil-mill/products", resource_type: "image" });
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
