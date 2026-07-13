// Serves page content for editorial pages.
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

export function getFaqGroups() {
  return faqGroups;
}

export function getStoryContent() {
  return { brandValuesDetailed, milestones, storyTimeline };
}

export function getProcessContent() {
  return { brandValues, processStepsDetailed, qualityStandards, sustainabilityPoints };
}
