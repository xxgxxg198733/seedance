import { NextResponse } from "next/server";
import { createPayPalOrder, PAYPAL_PLANS } from "@/lib/billing/paypal";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { plan: string; method?: "paypal" | "card" };

    const planInfo = PAYPAL_PLANS[body.plan];
    if (!planInfo) {
      return NextResponse.json({ error: `Unknown plan: ${body.plan}` }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? request.headers.get("referer")?.replace(/\/$/, "") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const baseUrl = new URL(origin).origin;

    const order = await createPayPalOrder(body.plan as any, baseUrl, body.method ?? "paypal");
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
