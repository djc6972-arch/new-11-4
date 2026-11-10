import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

// Reports which services are configured, without ever returning secret values.
export async function GET() {
  let database = "ok";
  try {
    await ensureSchema();
    await sql()`SELECT 1`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Strip anything that looks like a connection string before showing it.
    database = `error: ${message.replace(/postgres(ql)?:\/\/\S+/gi, "[connection string]").slice(0, 300)}`;
  }

  return NextResponse.json({
    database,
    databaseUrlSet: Boolean(process.env.DATABASE_URL ?? process.env.POSTGRES_URL),
    anthropicKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
    stripeKeySet: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}
