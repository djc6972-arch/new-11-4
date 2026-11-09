import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export const DEMO_EMAIL = "demo@demo.com";
export const FREE_PLANS = 3;
const DEMO_PASSWORD = "password123!";

let client: NeonQueryFunction<false, false> | null = null;

// Vercel's Neon integration sets DATABASE_URL (and POSTGRES_URL as an alias).
export function sql() {
  if (!client) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set. Connect a Neon database in Vercel (Storage tab).");
    }
    client = neon(url);
  }
  return client;
}

let schemaReady: Promise<void> | null = null;

// Creates the tables and the demo account the first time the app talks to the database.
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = sql();
      await db`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          is_paid BOOLEAN NOT NULL DEFAULT FALSE,
          plans_generated INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;
      await db`
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL
        )`;
      await db`
        CREATE TABLE IF NOT EXISTS meal_plans (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          calories INTEGER NOT NULL,
          protein INTEGER NOT NULL,
          plan JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;
      await db`
        CREATE TABLE IF NOT EXISTS payments (
          stripe_session_id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          amount_cents INTEGER NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;
      const demoHash = await bcrypt.hash(DEMO_PASSWORD, 10);
      await db`
        INSERT INTO users (email, name, password_hash, is_paid)
        VALUES (${DEMO_EMAIL}, 'Demo User', ${demoHash}, TRUE)
        ON CONFLICT (email) DO UPDATE SET is_paid = TRUE, password_hash = EXCLUDED.password_hash`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export type User = {
  id: number;
  email: string;
  name: string;
  is_paid: boolean;
  plans_generated: number;
};
