// Load environment variables
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

config({
  path: [".env.local", ".env"],
});

let db: ReturnType<typeof drizzle> | null = null;

const databaseUrl = process.env.POSTGRES_URL || process.env.NEON_POSTGRES_URL;

if (databaseUrl) {
  console.log("Using PostgreSQL database");
  const client = postgres(databaseUrl);
  db = drizzle(client, { schema });
}

export default db;
