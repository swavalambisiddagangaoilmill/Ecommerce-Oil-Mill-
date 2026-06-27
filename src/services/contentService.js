// Serves page content and marks where CMS/content APIs should connect.
import { API_ENDPOINTS } from "../config/apiConfig.js";
import {
  brandValuesDetailed,
  faqGroups,
  milestones,
  processStepsDetailed,
  qualityStandards,
  storyTimeline,
  sustainabilityPoints,
} from "../data/pageData.js";
import { brandValues } from "../data/siteData.js";
import { apiRequest } from "./apiClient.js";

export function getFaqGroups() {
  // Backend/CMS: replace with apiRequest(API_ENDPOINTS.faqs) when FAQ content is managed server-side.
  return faqGroups;
}

export function getStoryContent() {
  return { brandValuesDetailed, milestones, storyTimeline };
}

export function getProcessContent() {
  return { brandValues, processStepsDetailed, qualityStandards, sustainabilityPoints };
}

export async function fetchFaqsFromBackend() {
  return apiRequest(API_ENDPOINTS.faqs);
}
