// Admin notification model shared across all admin devices.
import mongoose from "mongoose";

const relatedSchema = new mongoose.Schema(
  {
    kind: { type: String, trim: true },
    id: { type: mongoose.Schema.Types.ObjectId },
    label: { type: String, trim: true },
    path: { type: String, trim: true },
  },
  { _id: false }
);

const adminNotificationSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: ["orders", "payments", "inventory", "customers", "security", "system"] },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    related: relatedSchema,
    dedupeKey: { type: String, trim: true, index: true },
    resolvedAt: { type: Date },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), index: { expires: 0 } },
  },
  { timestamps: true }
);

adminNotificationSchema.index({ createdAt: -1 });
adminNotificationSchema.index({ category: 1, type: 1, createdAt: -1 });

export default mongoose.model("AdminNotification", adminNotificationSchema);
