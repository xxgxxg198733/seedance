import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { capturePayPalOrder, PAYPAL_PLANS } from "@/lib/billing/paypal";

export async function POST(request: Request) {
  try {
    // Authenticate
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    const body = (await request.json()) as {
      orderId: string;
      plan: keyof typeof PAYPAL_PLANS;
    };

    const capture = await capturePayPalOrder(body.orderId);
    const amount = capture.purchase_units[0]?.payments?.captures[0]?.amount?.value;
    const planInfo = PAYPAL_PLANS[body.plan];
    const credits = planInfo?.credits ?? 0;

    // Add credits to user if logged in
    if (payload?.userId && capture.status === "COMPLETED") {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, credits: true },
      });
      if (user) {
        const newBalance = user.credits + credits;
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: newBalance, plan: (body.plan as any) ?? "FREE" },
        });
        await prisma.creditLog.create({
          data: {
            userId: user.id,
            amount: credits,
            type: "purchase",
            reference: body.orderId,
            balance: newBalance,
          },
        });
      }
    }

    return NextResponse.json({
      status: capture.status,
      captureId: capture.purchase_units[0]?.payments?.captures[0]?.id,
      amount,
      credits,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PayPal capture failed" },
      { status: 500 }
    );
  }
}
