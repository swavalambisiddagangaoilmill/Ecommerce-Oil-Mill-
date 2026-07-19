// Admin restriction management data access and actions.
import mongoose from "mongoose";
import Restriction from "../../models/Restriction.js";
import User from "../../models/User.js";
import { ApiError } from "../../utils/ApiError.js";

function statusFor(item) {
  if (item.status === "ACTIVE" && item.expiresAt <= new Date()) return "EXPIRED";
  return item.status;
}

function normalize(item) {
  const object = item.toObject ? item.toObject() : item;
  return { ...object, status: statusFor(object) };
}

export async function listRestrictions(query = {}) {
  const q = String(query.q || "").trim();
  const filter = {};
  if (q) {
    const or = [
      { email: new RegExp(q, "i") },
      { ip: new RegExp(q, "i") },
      { deviceId: new RegExp(q, "i") },
      { fingerprint: new RegExp(q, "i") },
    ];
    if (mongoose.Types.ObjectId.isValid(q)) or.push({ _id: q }, { account: q });
    filter.$or = or;
  }
  const items = await Restriction.find(filter).populate("account", "name email").sort({ createdAt: -1 }).limit(100);
  return { items: items.map(normalize) };
}

export async function getRestriction(id) {
  const item = await Restriction.findById(id).populate("account", "name email").populate("internalNotes.admin", "name email");
  if (!item) throw new ApiError("Restriction not found.", 404);
  return normalize(item);
}

export async function removeRestriction(id, admin, reason) {
  const item = await Restriction.findById(id);
  if (!item) throw new ApiError("Restriction not found.", 404);
  item.status = "REMOVED";
  item.removedAt = new Date();
  item.removedBy = admin._id;
  if (reason) item.internalNotes.push({ admin: admin._id, adminEmail: admin.email, note: `Removal reason: ${reason}` });
  await item.save();
  return normalize(await getRestriction(id));
}

export async function extendRestriction(id, admin, expiresAt, reason) {
  const item = await Restriction.findById(id);
  if (!item) throw new ApiError("Restriction not found.", 404);
  const nextExpiry = new Date(expiresAt);
  if (Number.isNaN(nextExpiry.getTime()) || nextExpiry <= new Date()) throw new ApiError("Expiry time must be in the future.", 400);
  item.status = "ACTIVE";
  item.expiresAt = nextExpiry;
  item.internalNotes.push({ admin: admin._id, adminEmail: admin.email, note: `Extended until ${nextExpiry.toISOString()}. ${reason || ""}`.trim() });
  await item.save();
  return normalize(await getRestriction(id));
}

export async function addRestrictionNote(id, admin, note) {
  const item = await Restriction.findById(id);
  if (!item) throw new ApiError("Restriction not found.", 404);
  item.internalNotes.push({ admin: admin._id, adminEmail: admin.email, note });
  await item.save();
  return normalize(await getRestriction(id));
}

export async function restrictionOptionsForAccount(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return User.findById(userId).select("email name");
}
