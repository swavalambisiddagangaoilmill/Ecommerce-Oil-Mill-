// Security event model for abuse and authorization telemetry.
import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    path: { type: String, trim: true },
    method: { type: String, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

securityEventSchema.index({ type: 1, createdAt: -1 });
securityEventSchema.index({ ip: 1, createdAt: -1 });
securityEventSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SecurityEvent", securityEventSchema);
