"use client";

// Check if Apple Pay / Payment Request API is available
export function canUseApplePay(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      "PaymentRequest" in window &&
      "ApplePaySession" in window &&
      (window as any).ApplePaySession?.canMakePayments()
    );
  } catch {
    return false;
  }
}

// Create a Payment Request for a plan
export function createApplePayRequest(plan: { name: string; amount: number }) {
  if (typeof window === "undefined") return null;

  const paymentMethods: PaymentMethodData[] = [
    {
      supportedMethods: "https://apple.com/apple-pay",
      data: {
        version: 3,
        merchantIdentifier: "merchant.com.seedance",
        merchantCapabilities: ["supports3DS"],
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        countryCode: "US",
      },
    },
    // Fallback to generic card
    {
      supportedMethods: "basic-card",
      data: {
        supportedNetworks: ["visa", "masterCard", "amex"],
      },
    },
  ];

  const details: PaymentDetailsInit = {
    id: `seedance-${plan.name}-${Date.now()}`,
    displayItems: [
      { label: `${plan.name} Plan (monthly)`, amount: { currency: "USD", value: String(plan.amount) } },
    ],
    total: {
      label: `Seedance — ${plan.name}`,
      amount: { currency: "USD", value: String(plan.amount) },
    },
  };

  try {
    return new PaymentRequest(paymentMethods, details);
  } catch {
    return null;
  }
}

// Process the payment response
export async function processApplePayPayment(
  paymentResponse: PaymentResponse,
  plan: string
): Promise<boolean> {
  try {
    const res = await fetch("/api/billing/paypal/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        paymentToken: btoa(JSON.stringify(paymentResponse.details)),
      }),
    });

    const data = await res.json();
    if (data.approveUrl) {
      window.location.href = data.approveUrl;
      return true;
    }

    await paymentResponse.complete("fail");
    return false;
  } catch {
    await paymentResponse.complete("fail");
    return false;
  }
}
