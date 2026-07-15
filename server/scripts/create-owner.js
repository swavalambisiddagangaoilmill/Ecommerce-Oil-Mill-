// Creates the first OWNER admin account without exposing a public signup endpoint.
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

const args = Object.fromEntries(process.argv.slice(2).map((part) => {
  const [key, ...rest] = part.replace(/^--/, "").split("=");
  return [key, rest.join("=")];
}));

async function promptMissing() {
  const rl = readline.createInterface({ input, output });
  const name = args.name || await rl.question("Owner name: ");
  const email = args.email || await rl.question("Owner email: ");
  const password = args.password || await rl.question("Owner password: ");
  rl.close();
  return { name, email, password };
}

await connectDB();
const existingOwner = await User.findOne({ role: "admin", adminRole: "OWNER", isDisabled: { $ne: true } });
if (existingOwner) {
  console.error("An active OWNER already exists. No account was created.");
  await mongoose.disconnect();
  process.exit(1);
}
const payload = await promptMissing();
await User.create({ ...payload, role: "admin", adminRole: "OWNER", emailVerified: true });
console.log(`OWNER account created for ${payload.email}.`);
await mongoose.disconnect();
