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

function layerPrefix(layer) {
  // DEBUG: Remove after auth routing issue is resolved
  if (!layer?.regexp?.source) return "";
  const match = layer.regexp.source.match(/^\^((?:\\\\\/[A-Za-z0-9_-]+)+)\\\\\/\?/);
  return match ? match[1].replace(/\\\\\//g, "/") : "";
}

function collectRoutes(stack = [], prefix = "") {
  // DEBUG: Remove after auth routing issue is resolved
  return stack.flatMap((layer) => {
    if (layer.route?.path) {
      return Object.keys(layer.route.methods).map((method) => `${method.toUpperCase()} ${prefix}${layer.route.path}`);
    }
    if (layer.name === "router" && layer.handle?.stack) {
      return collectRoutes(layer.handle.stack, `${prefix}${layerPrefix(layer)}`);
    }
    return [];
  });
}

function printRegisteredRoutes() {
  // DEBUG: Remove after auth routing issue is resolved
  const routes = collectRoutes(app._router?.stack || []);
  console.log("Registered Express routes:");
  routes.sort().forEach((route) => console.log(route));
}

await connectDB();
await ensureDefaultAdmin();
printRegisteredRoutes();

app.listen(env.port, () => {
  console.log(`Swavalambi Siddaganga Oil Mill API running on port ${env.port}`);
});
