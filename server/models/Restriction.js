// Stores temporary visitor and account restrictions for admin review.
import mongoose from "mongoose";

const restrictionNoteSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminEmail: { type: String, trim: true },
    note: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const restrictionSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true, trim: true },
    type: { type: String, enum: ["IP", "DEVICE", "BROWSER_FINGERPRINT", "ACCOUNT"], required: true },
    status: { type: String, enum: ["ACTIVE", "REMOVED", "EXPIRED"], default: "ACTIVE" },
    ip: { type: String, trim: true },
    deviceId: { type: String, trim: true },
    fingerprint: { type: String, trim: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, lowercase: true, trim: true },
    country: { type: String, trim: true },
    lastActivityAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    removedAt: { type: Date },
    removedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    internalNotes: [restrictionNoteSchema],
  },
  { timestamps: true }
);

restrictionSchema.index({ status: 1, expiresAt: 1 });
restrictionSchema.index({ ip: 1, status: 1 });
restrictionSchema.index({ deviceId: 1, status: 1 });
restrictionSchema.index({ fingerprint: 1, status: 1 });
restrictionSchema.index({ account: 1, status: 1 });
restrictionSchema.index({ email: 1 });

export default mongoose.model("Restriction", restrictionSchema);
