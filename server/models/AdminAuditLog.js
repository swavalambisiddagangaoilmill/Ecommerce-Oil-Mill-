// Admin audit log model.
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminEmail: { type: String, trim: true },
    action: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true },
    resourceId: { type: String, trim: true },
    summary: { type: String, trim: true },
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditSchema.index({ admin: 1, createdAt: -1 });
auditSchema.index({ resourceType: 1, createdAt: -1 });

export default mongoose.model("AdminAuditLog", auditSchema);
