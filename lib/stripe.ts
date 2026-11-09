import Stripe from "stripe";

// Price for MealMind Pro in cents. Set PRO_PRICE_CENTS=100 in Vercel for the $1 live test.
export const PRO_PRICE_CENTS = Number(process.env.PRO_PRICE_CENTS) || 499;
export const PRO_PRICE_LABEL = `$${(PRO_PRICE_CENTS / 100).toFixed(2)} one-time`;

let client: Stripe | null = null;

export function stripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables.");
    client = new Stripe(key);
  }
  return client;
}
