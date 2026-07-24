import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
    _stripe = new Stripe(key, { apiVersion: "2025-06-16.acacia" as any });
  }
  return _stripe;
}

export const PRICES = {
  LITE: {
    id: process.env.STRIPE_PRICE_LITE!,
    name: "Lite",
    amount: 20,
    credits: 200,
    resolution: "720P",
  },
  PRO: {
    id: process.env.STRIPE_PRICE_PRO!,
    name: "Pro",
    amount: 25,
    credits: 600,
    resolution: "1080P",
  },
  PREMIUM: {
    id: process.env.STRIPE_PRICE_PREMIUM!,
    name: "Premium",
    amount: 119,
    credits: 3000,
    resolution: "1080P",
  },
};

export const PLAN_BY_PRICE_ID: Record<string, keyof typeof PRICES> = {};
if (PRICES.LITE.id) PLAN_BY_PRICE_ID[PRICES.LITE.id] = "LITE";
if (PRICES.PRO.id) PLAN_BY_PRICE_ID[PRICES.PRO.id] = "PRO";
if (PRICES.PREMIUM.id) PLAN_BY_PRICE_ID[PRICES.PREMIUM.id] = "PREMIUM";

export { getStripe };
