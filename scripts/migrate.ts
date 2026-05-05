/**
 * Run once before first deployment (and again after schema changes).
 *
 * Usage:
 *   DATABASE_URL=<neon-connection-string> npx tsx scripts/migrate.ts
 *   DATABASE_URL=<neon-connection-string> npx tsx scripts/migrate.ts --seed
 */

import { applySchema } from "../lib/schema";
import { seedIfEmpty } from "../lib/seed";

async function main() {
  console.log("Applying schema...");
  await applySchema();
  console.log("Schema applied.");

  if (process.argv.includes("--seed")) {
    console.log("Seeding...");
    await seedIfEmpty();
    console.log("Done.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
