// Starts the API server after the database connection is ready.
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

await connectDB();

app.listen(env.port, () => {
  console.log(`Swavalambi Siddaganga Oil Mill API running on port ${env.port}`);
});
