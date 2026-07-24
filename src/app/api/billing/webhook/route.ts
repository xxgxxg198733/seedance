import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, PLAN_BY_PRICE_ID } from "@/lib/billing/stripe";
import { prisma } from "@/lib/db/prisma";

const CREDITS_BY_PLAN: Record<string, number> = {
  LITE: 200,
  PRO: 600,
  PREMIUM: 3000,
};

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${err}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const plan = session.metadata?.plan;
        const clerkId = session.client_reference_id;
        const email = session.customer_details?.email;

        if (customerId && clerkId && plan) {
          // Update user with Stripe customer ID
          await prisma.user.update({
            where: { clerkId },
            data: {
              stripeCustomerId: customerId,
              plan: plan as "FREE" | "LITE" | "PRO" | "PREMIUM",
              credits: { increment: CREDITS_BY_PLAN[plan] ?? 0 },
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const priceId = (invoice.lines.data[0] as any)?.price?.id;

        if (customerId && priceId) {
          const plan = PLAN_BY_PRICE_ID[priceId];
          if (plan) {
            // Monthly credit renewal
            const user = await prisma.user.findFirst({
              where: { stripeCustomerId: customerId },
            });
            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: { credits: { increment: CREDITS_BY_PLAN[plan] } },
              });
              await prisma.creditLog.create({
                data: {
                  userId: user.id,
                  amount: CREDITS_BY_PLAN[plan],
                  type: "monthly_renewal",
                  balance: user.credits + CREDITS_BY_PLAN[plan],
                  reference: invoice.id,
                },
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: "FREE" },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
