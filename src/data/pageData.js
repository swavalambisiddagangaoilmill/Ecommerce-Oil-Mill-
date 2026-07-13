// Static story, process, and FAQ content used until CMS APIs are connected.
import { BadgeCheck, HeartHandshake, Leaf, PackageCheck, Recycle, SearchCheck, ShieldCheck, Sprout, Truck, Wheat } from "lucide-react";

export const faqGroups = [
  {
    category: "Products",
    items: [
      {
        q: "Are Velora oils refined?",
        a: "No. Our oils are cold pressed, naturally settled, and bottled without refining, bleaching, deodorising, or synthetic additives.",
      },
      {
        q: "Which oil is best for everyday Indian cooking?",
        a: "Groundnut, sunflower, sesame, and mustard oils are strong everyday choices. Pick based on your flavor preference and recipe style.",
      },
      {
        q: "Why does cold pressed oil look slightly different between batches?",
        a: "Small natural variations can appear because seed harvests, settling time, and seasonal moisture change. We preserve that character while testing for purity.",
      },
    ],
  },
  {
    category: "Storage",
    items: [
      {
        q: "How should I store the oils?",
        a: "Keep bottles tightly closed in a cool pantry away from sunlight, heat, and moisture. Amber glass helps protect the oil after opening.",
      },
      {
        q: "What is the shelf life?",
        a: "Most Velora oils are best used within 8 to 12 months. Each bottle should be consumed sooner after opening for the cleanest aroma.",
      },
      {
        q: "Can the oil be refrigerated?",
        a: "Refrigeration is not required. Some oils may turn cloudy in low temperatures and return to normal at room temperature.",
      },
    ],
  },
  {
    category: "Orders",
    items: [
      {
        q: "Do you ship across India?",
        a: "This storefront is ready for pan-India shipping rules once connected to the backend. Current copy and flows are prepared for that setup.",
      },
      {
        q: "Do you offer bulk or gifting orders?",
        a: "Yes. The brand system supports curated bundles, corporate gifting, and recurring pantry orders through the contact flow.",
      },
      {
        q: "What if a bottle arrives damaged?",
        a: "Contact support with order details and photos. The care team can review the shipment and arrange the next step.",
      },
    ],
  },
];

export const storyTimeline = [
  { year: "2019", title: "A family pantry question", text: "Velora began with a search for oils that tasted honest, looked refined, and could be trusted every day." },
  { year: "2020", title: "Small-batch pressing", text: "We built relationships with seed suppliers and focused on slow extraction instead of scale-first production." },
  { year: "2022", title: "Amber glass standard", text: "Packaging was redesigned around freshness, shelf presence, and a calmer luxury pantry experience." },
  { year: "2026", title: "Digital-first oil house", text: "The brand now brings cold pressed staples into a complete premium ecommerce experience." },
];

export const brandValuesDetailed = [
  { icon: Leaf, title: "Slow by design", text: "Pressing speed, settling time, and dispatch rhythm are chosen to protect natural aroma." },
  { icon: ShieldCheck, title: "Clean pantry promise", text: "No refining shortcuts, no loud claims, just oils selected and packed with discipline." },
  { icon: Wheat, title: "Seed-first sourcing", text: "Every bottle starts with carefully selected seeds and batches that can be traced." },
  { icon: HeartHandshake, title: "Modern warmth", text: "Traditional oils are presented with clarity, care, and a premium everyday sensibility." },
];

export const milestones = [
  "7 single-origin oil styles curated",
  "Amber packaging system introduced",
  "Cold pressed range built for daily Indian cooking",
  "Gift-ready bundles designed for premium pantry rituals",
];

export const processStepsDetailed = [
  { icon: SearchCheck, title: "Seed Selection", text: "Seeds are checked for density, aroma, and batch quality before entering production." },
  { icon: Sprout, title: "Resting & Cleaning", text: "Raw materials are cleaned, sorted, and prepared without aggressive chemical treatment." },
  { icon: Leaf, title: "Cold Pressing", text: "Slow extraction preserves natural character while avoiding heat-heavy refining processes." },
  { icon: BadgeCheck, title: "Natural Settling", text: "Oil rests so sediment can separate naturally before filtration and bottling." },
  { icon: PackageCheck, title: "Protective Packing", text: "Amber glass and careful sealing help protect freshness through storage and transit." },
  { icon: Truck, title: "Fresh Dispatch", text: "Batches are packed thoughtfully and moved into delivery with pantry freshness in mind." },
];

export const qualityStandards = [
  "Batch-level purity checks",
  "Low-heat extraction discipline",
  "No bleaching or deodorising",
  "Freshness-first packaging",
];

export const sustainabilityPoints = [
  { icon: Recycle, title: "Recyclable packaging", text: "Glass-first presentation reduces plastic reliance and keeps bottles pantry-worthy." },
  { icon: Sprout, title: "Responsible sourcing", text: "Trusted farm networks and smaller batches help reduce wasteful overproduction." },
  { icon: Leaf, title: "Minimal intervention", text: "Natural settling and clean extraction keep the production footprint thoughtful." },
];


