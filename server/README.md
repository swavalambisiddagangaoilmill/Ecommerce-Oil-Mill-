# Velora Backend

Production-ready Express + MongoDB backend for the Velora MERN storefront.

## Setup

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

## Scripts

- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with Node.
- `npm run seed` creates an admin user, categories, and demo products.
- `npm run reset` clears seeded collections.

## Structure

- `config/` centralizes environment, database, and Cloudinary config.
- `controllers/` handles request and response only.
- `services/` contains business logic.
- `routes/` registers API endpoints.
- `models/` defines Mongoose schemas.
- `validators/` contains express-validator chains.
- `middleware/` contains auth, admin, validation, upload, and error middleware.
- `utils/` contains reusable response, JWT, async, slug, and error helpers.

## API Base

All endpoints are mounted under `/api`.

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/profile`
- Products: `/api/products`, `/api/products/featured`, `/api/products/:slug`
- Categories: `/api/categories`
- Wishlist: `/api/wishlist`
- Orders: `/api/orders`
- Payments: `/api/payments/intent`, `/api/payments/verify`
- Uploads: `/api/upload/image`

Payment and upload providers are ready for production integration through the service/controller placeholders.
