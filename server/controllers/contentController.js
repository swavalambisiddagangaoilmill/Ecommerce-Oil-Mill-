// Content controller serves static editorial content through API endpoints.
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

const faqs = [
  { category: "Products", items: [{ question: "What is cold pressed oil?", answer: "Cold pressed oil is extracted without high heat so the natural aroma and nutrients are better preserved." }] },
  { category: "Orders", items: [{ question: "How long does delivery take?", answer: "Most orders are delivered within 2-5 business days depending on serviceability." }] },
];

export const getFaqs = asyncHandler(async (_req, res) => {
  sendSuccess(res, 200, "FAQs fetched successfully", { groups: faqs });
});

export const getPageContent = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Page content fetched successfully", { slug: req.params.slug, sections: [] });
});
