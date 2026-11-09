import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { sql } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import SiteHeader from "../../SiteHeader";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const user = await requireUser();
  const { session_id } = await searchParams;

  let confirmed = false;
  if (session_id) {
    // Ask Stripe directly whether this checkout was paid, so the URL alone can't unlock Pro.
    const session = await stripe().checkout.sessions.retrieve(session_id).catch(() => null);
    if (session && session.payment_status === "paid" && session.client_reference_id === String(user.id)) {
      await sql()`
        INSERT INTO payments (stripe_session_id, user_id, amount_cents)
        VALUES (${session.id}, ${user.id}, ${session.amount_total ?? 0})
        ON CONFLICT (stripe_session_id) DO NOTHING`;
      await sql()`UPDATE users SET is_paid = TRUE WHERE id = ${user.id}`;
      confirmed = true;
    }
  }
  if (confirmed) redirect("/dashboard?paid=1");

  return (
    <div className="wrap">
      <SiteHeader />
      <main className="auth-page">
        <div className="card auth">
          <h1>We couldn't confirm that payment</h1>
          <p className="muted">
            If you were charged, refresh this page in a moment. Otherwise head back and try again.
          </p>
          <Link href="/dashboard" className="btn primary">Back to my plans</Link>
        </div>
      </main>
    </div>
  );
}
