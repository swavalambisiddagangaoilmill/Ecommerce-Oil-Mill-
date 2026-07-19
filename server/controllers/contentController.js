// Contact, newsletter, and public content controller backed by MongoDB with safe fallbacks.
import ContactMessage from "../models/ContactMessage.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import SiteContent from "../models/SiteContent.js";
import { createAdminNotification } from "../services/adminNotificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { verifyTurnstile } from "../services/turnstileService.js";

const faqs = [
  { category: "Products", items: [{ question: "What is cold pressed oil?", answer: "Cold pressed oil is extracted without high heat so the natural aroma and nutrients are better preserved." }] },
  { category: "Orders", items: [{ question: "How long does delivery take?", answer: "Most orders are delivered within 2-5 business days depending on serviceability." }] },
];

export const submitContact = asyncHandler(async (req, res) => {
  await verifyTurnstile(req.body.turnstileToken, req);
  const message = await ContactMessage.create({ name: req.body.name, email: req.body.email, phone: req.body.phone, subject: req.body.subject, message: req.body.message });
  await createAdminNotification({ category: "customers", type: "contact_form_submission", title: "Contact Form Submission", description: `${message.name} sent a message.`, related: { kind: "ContactMessage", id: message._id, label: message.email, path: "/admin/messages" } });
  sendSuccess(res, 201, "Message received successfully", { message });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  await verifyTurnstile(req.body.turnstileToken, req);
  const subscription = await NewsletterSubscriber.findOneAndUpdate({ email: req.body.email }, { email: req.body.email, status: "ACTIVE", subscribedAt: new Date() }, { upsert: true, new: true, runValidators: true });
  await createAdminNotification({ category: "customers", type: "newsletter_subscription", title: "Newsletter Subscription", description: `${subscription.email} subscribed to the newsletter.`, related: { kind: "NewsletterSubscriber", id: subscription._id, label: subscription.email, path: "/admin/newsletter" } });
  sendSuccess(res, 201, "Newsletter subscription saved", { subscription });
});

export const getFaqs = asyncHandler(async (_req, res) => {
  sendSuccess(res, 200, "FAQs fetched successfully", { groups: faqs });
});

export const getPageContent = asyncHandler(async (req, res) => {
  const content = await SiteContent.findOne({ key: req.params.slug });
  sendSuccess(res, 200, "Page content fetched successfully", { slug: req.params.slug, sections: content?.value?.sections || [], value: content?.value || null });
});
