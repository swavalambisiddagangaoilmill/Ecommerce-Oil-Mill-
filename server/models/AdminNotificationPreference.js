// Per-admin notification preference model.
import mongoose from "mongoose";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    disabledTypes: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.model("AdminNotificationPreference", notificationPreferencesSchema);
