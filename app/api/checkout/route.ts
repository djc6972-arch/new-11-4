import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PRO_PRICE_CENTS, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(`${origin}/login`, 303);
  if (user.is_paid) return NextResponse.redirect(`${origin}/dashboard`, 303);

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      client_reference_id: String(user.id),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PRO_PRICE_CENTS,
            product_data: {
              name: "MealMind Pro",
              description: "Unlimited AI meal plans that hit your calorie and protein goals.",
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?canceled=1`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("stripe checkout failed", err);
    return NextResponse.json({ error: "Checkout isn't available right now." }, { status: 500 });
  }
}
