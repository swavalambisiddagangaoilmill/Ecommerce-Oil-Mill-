// Stores short-lived Razorpay QR checkout references.
import mongoose from "mongoose";

const paymentCheckoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: { type: String, default: "razorpay" },
    type: { type: String, enum: ["upi_qr"], required: true },
    status: { type: String, enum: ["created", "paid", "expired", "failed"], default: "created", index: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR" },
    razorpayQrId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    imageUrl: { type: String },
    orderPayload: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentCheckout", paymentCheckoutSchema);
