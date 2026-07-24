import { NextResponse } from "next/server";
import { createPayPalOrder, PAYPAL_PLANS } from "@/lib/billing/paypal";

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: "LITE" | "PRO" | "PREMIUM" };
    if (!PAYPAL_PLANS[plan]) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const order = await createPayPalOrder(plan);
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
