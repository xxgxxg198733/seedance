import { NextResponse } from "next/server";
import { createPayPalOrder, PAYPAL_PLANS } from "@/lib/billing/paypal";

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: string };

    const planInfo = PAYPAL_PLANS[plan];
    if (!planInfo) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    // Use the actual request origin, fallback to env
    const origin = request.headers.get("origin") ?? request.headers.get("referer")?.replace(/\/$/, "") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const baseUrl = new URL(origin).origin;

    const order = await createPayPalOrder(plan as any, baseUrl);
    const approveUrl = order.links?.find((l) => l.rel === "payer-action")?.href
      ?? order.links?.find((l) => l.rel === "approve")?.href;

    return NextResponse.json({ orderId: order.id, approveUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal create failed" },
      { status: 500 }
    );
  }
}
