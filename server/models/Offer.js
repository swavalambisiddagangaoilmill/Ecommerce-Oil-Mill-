// Admin-managed offer model.
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    scope: { type: String, enum: ["STORE", "CATEGORY", "PRODUCTS"], default: "STORE" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bannerText: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

offerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
export default mongoose.model("Offer", offerSchema);

