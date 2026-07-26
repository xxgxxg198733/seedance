import { NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/billing/paypal";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const body = await request.text();

  // Verify webhook signature
  const verified = await verifyPayPalWebhook(body, request.headers);
  if (!verified) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });

  const event = JSON.parse(body) as {
    event_type: string;
    resource: {
      purchase_units?: Array<{
        reference_id: string;
        amount: { value: string };
      }>;
      billing_agreement_id?: string;
      id: string;
    };
  };

  try {
    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED": {
        // Payment completed — add credits
        // In production: look up user by reference_id or custom_id
        break;
      }

      case "PAYMENT.CAPTURE.COMPLETED": {
        const amount = event.resource.purchase_units?.[0]?.amount?.value;
        if (amount) {
          // Add credits based on captured amount
          const creditsByAmount: Record<string, number> = { "20.1": 36000, "34.9": 66000, "62.9": 156000, "50": 5000, "100": 14000 };
          const credits = creditsByAmount[amount] ?? Math.floor(Number(amount) * 20);

          const user = await prisma.user.findFirst();
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { credits: { increment: credits } },
            });
            await prisma.creditLog.create({
              data: {
                userId: user.id,
                amount: credits,
                type: "purchase",
                balance: user.credits + credits,
                reference: event.resource.id,
              },
            });
          }
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED": {
        const user = await prisma.user.findFirst();
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "FREE" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
