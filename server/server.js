// Starts the API server after the database connection is ready.
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureDefaultAdmin } from "./services/defaultAdminService.js";

// DEBUG: Remove after Google OAuth issue is resolved
console.log("[Startup Env Debug]", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Missing",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Loaded" : "Missing",
  CLIENT_URL: process.env.CLIENT_URL ? "Loaded" : "Missing",
});

await connectDB();
await ensureDefaultAdmin();

app.listen(env.port, () => {
  console.log(`Swavalambi Siddaganga Oil Mill API running on port ${env.port}`);
});
