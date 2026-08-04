"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

type PlanKey = "STARTER" | "PREMIUM" | "ADVANCED" | "PRO";

interface PayPalButtonProps {
  plan: PlanKey;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function PayPalButtonInner({ plan, amount, onSuccess, onError }: PayPalButtonProps) {
  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "pay",
      }}
      createOrder={async () => {
        const res = await fetch("/api/billing/paypal/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, method: "paypal" }),
        });
        const data = await res.json();
        if (!data.orderId) {
          throw new Error(data.error ?? "Failed to create order");
        }
        return data.orderId;
      }}
      onApprove={async (data) => {
        const res = await fetch("/api/billing/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID, plan }),
        });
        const capture = await res.json();
        if (!res.ok) throw new Error(capture.error ?? "Capture failed");
        onSuccess?.();
      }}
      onError={(err) => {
        console.error("PayPal error:", err);
        onError?.(String(err));
      }}
    />
  );
}

export function PayPalButton({ plan, amount, onSuccess, onError }: PayPalButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!clientId) {
    return (
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-950/30 p-3 text-center text-xs text-yellow-400">
        PayPal not configured (missing NEXT_PUBLIC_PAYPAL_CLIENT_ID)
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
      }}
    >
      <PayPalButtonInner plan={plan} amount={amount} onSuccess={onSuccess} onError={onError} />
    </PayPalScriptProvider>
  );
}
