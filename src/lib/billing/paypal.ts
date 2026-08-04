const PAYPAL_API = process.env.PAYPAL_SANDBOX === "true"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export const PAYPAL_PLANS: Record<string, { name: string; amount: number; credits: number }> = {
  STARTER: { name: "Starter Plan", amount: 20.1, credits: 36000 },
  PREMIUM: { name: "Premium Plan", amount: 34.9, credits: 66000 },
  ADVANCED: { name: "Advanced Plan", amount: 62.9, credits: 156000 },
  PRO: { name: "Pro Plan (Legacy)", amount: 25, credits: 600 },
};

// Create a PayPal subscription order
export async function createPayPalOrder(plan: keyof typeof PAYPAL_PLANS, baseUrl: string) {
  const token = await getPayPalToken();
  const { name, amount } = PAYPAL_PLANS[plan];

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": crypto.randomUUID(),
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: crypto.randomUUID(),
        description: `${name} — Monthly Subscription`,
        amount: { currency_code: "USD", value: String(amount) },
      }],
      application_context: {
        brand_name: "Seedance",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/settings?paypal=success`,
        cancel_url: `${baseUrl}/pricing?paypal=cancelled`,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { id: string; links: Array<{ rel: string; href: string }> };
  return data;
}

// Capture an approved order
export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${err}`);
  }

  return res.json() as Promise<{
    id: string;
    status: string;
    purchase_units: Array<{
      reference_id: string;
      payments: { captures: Array<{ id: string; amount: { value: string } }> };
    }>;
  }>;
}

// Verify webhook signature
export async function verifyPayPalWebhook(body: string, headers: Headers) {
  const token = await getPayPalToken();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo")!,
      cert_url: headers.get("paypal-cert-url")!,
      transmission_id: headers.get("paypal-transmission-id")!,
      transmission_sig: headers.get("paypal-transmission-sig")!,
      transmission_time: headers.get("paypal-transmission-time")!,
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });

  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
