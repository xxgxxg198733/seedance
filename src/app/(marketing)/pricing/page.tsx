"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

const plans = [
  { key: "LITE" as const, name: "Lite", price: 20, credits: "200 credits", resolution: "720P", desc: "For hobbyists & casual creators", popular: false },
  { key: "PRO" as const, name: "Pro", price: 25, credits: "600 credits", resolution: "1080P", desc: "For professional content creators", popular: true },
  { key: "PREMIUM" as const, name: "Premium", price: 119, credits: "3,000 credits", resolution: "1080P", desc: "For teams & power users", popular: false },
];

const features = [
  "Top-quality AI models",
  "No watermarks",
  "Full commercial use",
  "Private creation",
  "Fast generation mode",
  "Templates & presets",
];

export default function PricingPage() {
  const [paypalLoading, setPaypalLoading] = useState<string | null>(null);

  const checkoutPayPal = async (plan: "LITE" | "PRO" | "PREMIUM") => {
    setPaypalLoading(plan);
    try {
      const res = await fetch("/api/billing/paypal/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.approveUrl) window.location.href = data.approveUrl;
      else alert(data.error ?? "PayPal checkout failed");
    } catch {
      alert("PayPal checkout failed");
    } finally {
      setPaypalLoading(null);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-zinc-400">Start with 20 free credits. Pay with PayPal.</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.key} className={`relative rounded-2xl border p-8 ${plan.popular ? "border-violet-500/50 bg-violet-950/20" : "border-zinc-800 bg-zinc-900/50"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.credits}/month · Up to {plan.resolution}</p>

              <button onClick={() => checkoutPayPal(plan.key)} disabled={paypalLoading !== null}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0070ba] text-sm font-medium text-white hover:bg-[#005ea6] transition-colors disabled:opacity-50">
                {paypalLoading === plan.key ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.323c-.577 0-1.05.423-1.135.995l-.603 3.82c-.072.452-.46.794-.916.794h-.008"/></svg>
                )}
                Pay with PayPal
              </button>

              <ul className="mt-6 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <h3 className="text-xl font-semibold text-white">How credits work</h3>
          <p className="mt-2 text-zinc-400">
            ~5 credits per video · ~2 credits per image. Unused credits roll over.<br />
            All plans include watermark-free output and full commercial usage rights.
          </p>
        </div>
      </div>
    </div>
  );
}
