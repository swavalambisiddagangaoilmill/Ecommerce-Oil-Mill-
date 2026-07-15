// Persisted customer contact messages.
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, default: "Website message" },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["NEW", "READ", "RESOLVED", "ARCHIVED"], default: "NEW" },
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
export default mongoose.model("ContactMessage", contactMessageSchema);
