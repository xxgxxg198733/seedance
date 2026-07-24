import { NextResponse } from "next/server";
import { capturePayPalOrder, PAYPAL_PLANS } from "@/lib/billing/paypal";

export async function POST(request: Request) {
  try {
    const { orderId, plan } = (await request.json()) as {
      orderId: string;
      plan: keyof typeof PAYPAL_PLANS;
    };

    const capture = await capturePayPalOrder(orderId);

    return NextResponse.json({
      status: capture.status,
      captureId: capture.purchase_units[0]?.payments?.captures[0]?.id,
      amount: capture.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      credits: PAYPAL_PLANS[plan]?.credits ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal capture failed" },
      { status: 500 }
    );
  }
}
