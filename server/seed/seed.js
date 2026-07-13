// Database seed script for local development data.
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";

const resetOnly = process.argv.includes("--reset");

const categorySeeds = [
  ["Groundnut Oils", "Daily cooking oils with a balanced nutty finish."],
  ["Sesame Oils", "Traditional oils for cooking, massage, and wellness rituals."],
  ["Coconut Oils", "Aromatic oils for cooking and pantry care."],
  ["Mustard Oils", "Bold cold pressed oils for regional recipes."],
  ["Sunflower Oils", "Light everyday oils for family kitchens."],
  ["Wellness Oils", "Small-batch oils for mindful care routines."],
];

const productNames = [
  "Classic Groundnut Oil", "Wood Pressed Groundnut Oil", "Family Groundnut Oil", "Roasted Groundnut Oil",
  "Golden Sesame Oil", "Black Sesame Oil", "Traditional Gingelly Oil", "Sesame Wellness Oil",
  "Virgin Coconut Oil", "Coconut Cooking Oil", "Aromatic Coconut Oil",
  "Kachi Ghani Mustard Oil", "Premium Mustard Oil", "Mustard Cooking Oil",
  "Cold Pressed Sunflower Oil", "Light Sunflower Oil", "Everyday Sunflower Oil",
  "Flaxseed Wellness Oil", "Castor Care Oil", "Almond Wellness Oil",
];

function productCategoryIndex(index) {
  if (index < 4) return 0;
  if (index < 8) return 1;
  if (index < 11) return 2;
  if (index < 14) return 3;
  if (index < 17) return 4;
  return 5;
}

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  if (resetOnly) {
    console.log("Database reset complete.");
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({ name: "Admin User", email: "admin@velora.test", password: "Admin@12345", role: "admin" });
  const categories = await Category.insertMany(
    categorySeeds.map(([name, description], index) => ({
      name,
      slug: slugify(name),
      description,
      image: `https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80&sig=${index}`,
    })),
  );

  await Product.insertMany(
    productNames.map((title, index) => ({
      title,
      slug: slugify(title),
      description: `${title} is crafted in small batches for clean flavor, natural aroma, and everyday kitchen confidence.`,
      price: 349 + index * 25,
      discountPrice: index % 3 === 0 ? 299 + index * 20 : undefined,
      stock: 24 + index,
      category: categories[productCategoryIndex(index)]._id,
      images: [{ url: `https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80&sig=product-${index}` }],
      featured: index < 8,
      isActive: true,
    })),
  );

  console.log(`Seed complete. Admin: ${admin.email} / Admin@12345`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
