// Simple development-only seed data for local testing.
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { slugify } from "../utils/slugify.js";

if (process.env.NODE_ENV === "production") {
  console.error("Seed script is disabled in production.");
  process.exit(1);
}

const resetOnly = process.argv.includes("--reset");

const imageUrls = [
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=900&q=80",
];

const categorySeeds = [
  ["Groundnut Oils", "Daily cooking oils with a balanced nutty finish."],
  ["Sesame Oils", "Traditional oils for cooking and wellness rituals."],
  ["Coconut Oils", "Aromatic oils for cooking and pantry care."],
  ["Mustard Oils", "Bold cold pressed oils for regional recipes."],
  ["Sunflower Oils", "Light everyday oils for family kitchens."],
  ["Wellness Oils", "Small-batch oils for mindful care routines."],
];

const productSeeds = [
  ["Classic Groundnut Oil", 349, 299, 18, 0, true],
  ["Wood Pressed Groundnut Oil", 399, 349, 14, 0, true],
  ["Golden Sesame Oil", 449, 399, 16, 1, true],
  ["Traditional Gingelly Oil", 429, 379, 12, 1, true],
  ["Virgin Coconut Oil", 499, 449, 10, 2, true],
  ["Kachi Ghani Mustard Oil", 379, 329, 20, 3, false],
  ["Cold Pressed Sunflower Oil", 329, 299, 22, 4, false],
  ["Flaxseed Wellness Oil", 599, 549, 8, 5, false],
];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  if (resetOnly) {
    console.log("Database reset complete.");
    await mongoose.disconnect();
    return;
  }

  const admin = await User.create({
    name: "Admin User",
    email: "admin@ss-oil-mill.test",
    password: "Admin@12345",
    role: "admin",
    emailVerified: true,
  });

  const categories = await Category.insertMany(
    categorySeeds.map(([name, description], index) => ({
      name,
      slug: slugify(name),
      description,
      image: imageUrls[index % imageUrls.length],
    }))
  );

  const products = await Product.insertMany(
    productSeeds.map(([title, price, discountPrice, stock, categoryIndex, featured], index) => ({
      title,
      slug: slugify(title),
      description: `${title} is a simple test product for local development and API checks.`,
      price,
      discountPrice,
      stock,
      category: categories[categoryIndex]._id,
      images: [{ url: imageUrls[index % imageUrls.length], publicId: null }],
      featured,
      isActive: true,
    }))
  );

  console.log(`Seed complete. Categories: ${categories.length}. Products: ${products.length}. Admin: ${admin.email} / Admin@12345`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
