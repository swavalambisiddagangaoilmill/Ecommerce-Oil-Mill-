// Contact and newsletter controller.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const submitContact = asyncHandler(async (req, res) => {
  sendSuccess(res, 201, "Message received successfully", { message: { ...req.body, receivedAt: new Date().toISOString() } });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  sendSuccess(res, 201, "Newsletter subscription saved", { subscription: { email: req.body.email, subscribedAt: new Date().toISOString() } });
});
