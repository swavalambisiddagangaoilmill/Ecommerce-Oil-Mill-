// Product catalog business logic.
import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";

function buildProductQuery(query) {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.featured) filter.featured = query.featured === "true";
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.search) filter.$text = { $search: query.search };
  return filter;
}

function buildSort(sort = "newest") {
  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    featured: { featured: -1, createdAt: -1 },
  };
  return sortMap[sort] || sortMap.newest;
}

export async function listProducts(query) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const filter = buildProductQuery(query);
  const [items, total] = await Promise.all([
    Product.find(filter).populate("category", "name slug").sort(buildSort(query.sort)).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getFeaturedProducts() {
  return Product.find({ featured: true, isActive: true }).populate("category", "name slug").sort({ createdAt: -1 }).limit(12);
}

export async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true }).populate("category", "name slug");
  if (!product) throw new ApiError("Product not found.", 404);
  return product;
}

export async function getProductsByCategory(categoryId, query) {
  return listProducts({ ...query, category: categoryId });
}

export async function getRelatedProducts(productId, limit = 6) {
  const current = await Product.findById(productId);
  if (!current) throw new ApiError("Product not found.", 404);
  const safeLimit = Math.min(Math.max(Number(limit) || 6, 4), 8);
  const sameCategory = await Product.find({ _id: { $ne: current._id }, category: current.category, isActive: true })
    .populate("category", "name slug")
    .limit(safeLimit);
  if (sameCategory.length >= safeLimit) return sameCategory;
  const fallback = await Product.find({ _id: { $ne: current._id }, category: { $ne: current.category }, isActive: true })
    .populate("category", "name slug")
    .limit(safeLimit - sameCategory.length);
  return [...sameCategory, ...fallback];
}

export async function createProduct(payload) {
  const slug = payload.slug || slugify(payload.title);
  return Product.create({ ...payload, slug });
}

export async function updateProduct(id, payload) {
  const updates = payload.title && !payload.slug ? { ...payload, slug: slugify(payload.title) } : payload;
  const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!product) throw new ApiError("Product not found.", 404);
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError("Product not found.", 404);
  return product;
}
