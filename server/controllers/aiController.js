// Chat assistant controller for lightweight storefront guidance.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const responses = {
  "Best cooking oil": { text: "For everyday cooking, groundnut oil is a versatile choice because it has a warm nutty aroma and works well for Indian recipes.", followUps: ["Compare oils", "Storage tips", "Cold pressed vs refined"] },
  "Oils for children": { text: "For children, use familiar cooking oils in moderation and follow your pediatrician's advice for allergies or dietary needs.", followUps: ["Best cooking oil", "Storage tips"] },
  "Cold pressed vs refined": { text: "Cold pressed oils are extracted slowly with less heat, while refined oils are usually processed further for neutral flavor and longer shelf stability.", followUps: ["Compare oils", "Best cooking oil"] },
  "Storage tips": { text: "Store cooking oils tightly closed in a cool pantry, away from direct sunlight, heat, and moisture.", followUps: ["Best cooking oil", "Cold pressed vs refined"] },
  "Compare oils": { text: "Groundnut is robust for daily cooking, sesame is aromatic for tempering, mustard is sharp, and coconut is useful for traditional recipes and rituals.", followUps: ["Best cooking oil", "Storage tips"] },
};

export const chatAssistant = asyncHandler(async (req, res) => {
  const response = responses[req.body.message] || { text: "AI assistance is currently unavailable for this question. Please contact our support team for personalized assistance.", followUps: ["Best cooking oil", "Storage tips", "Compare oils"] };
  sendSuccess(res, 200, "Assistant response created", response);
});
