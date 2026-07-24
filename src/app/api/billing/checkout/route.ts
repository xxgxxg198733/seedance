import { NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/billing/stripe";

export async function POST(request: Request) {
  try {
    const { plan, successUrl, cancelUrl } = (await request.json()) as {
      plan: "LITE" | "PRO" | "PREMIUM";
      successUrl?: string;
      cancelUrl?: string;
    };

    const price = PRICES[plan];
    if (!price?.id) {
      return NextResponse.json({ error: `Price not configured for plan: ${plan}` }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl ?? `${baseUrl}/settings?checkout=success`,
      cancel_url: cancelUrl ?? `${baseUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
