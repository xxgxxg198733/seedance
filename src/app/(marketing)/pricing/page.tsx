"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Gift } from "lucide-react";

const monthlyPlans = [
  {
    key: "STARTER" as const, name: "Starter", price: 20.1, originalPrice: 28.4,
    credits: "36,000 credits/yr", videoCount: "276 videos", imageCount: "7,200 images",
    desc: "For individual creators getting started", popular: false,
  },
  {
    key: "PREMIUM" as const, name: "Premium", price: 34.9, originalPrice: 49.9,
    credits: "66,000 credits/yr", videoCount: "516 videos", imageCount: "13,600 images",
    desc: "For professional content creators", popular: true,
  },
  {
    key: "ADVANCED" as const, name: "Advanced", price: 62.9, originalPrice: 89.9,
    credits: "156,000 credits/yr", videoCount: "1,212 videos", imageCount: "32,000 images",
    desc: "For teams & power users", popular: false,
  },
];

const creditPacks = [
  { credits: "5,000", price: 50 },
  { credits: "14,000", price: 100 },
];

const sharedFeatures = [
  "Access all AI models",
  "Prompt generator",
  "Video history",
  "Full commercial license",
  "Credits roll over & never expire",
];

export default function PricingPage() {
  const router = useRouter();
  const [annual, setAnnual] = useState(true);
  const [paypalLoading, setPaypalLoading] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setLoggedIn(!!d.user)).catch(() => {});
  }, []);

  const plans = annual ? monthlyPlans : monthlyPlans.map(p => ({
    ...p, price: Math.round(p.price * 12 * 0.7) / 12, originalPrice: p.price,
  }));

  const handleSubscribe = (plan: string) => {
    if (!loggedIn) {
      router.push(`/login?redirect=/pricing`);
      return;
    }
    checkoutPayPal(plan);
  };

  const checkoutPayPal = async (plan: string) => {
    setPaypalLoading(plan);
    try {
      const res = await fetch("/api/billing/paypal/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const d = await res.json();
      if (d.approveUrl) window.location.href = d.approveUrl;
      else alert(d.error ?? "Checkout failed");
    } catch { alert("Checkout failed"); }
    finally { setPaypalLoading(null); }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-zinc-400">Choose the plan that fits your creative needs.</p>
        </div>

        {/* Annual/Monthly toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-xl bg-zinc-900 p-1">
            <button onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium transition-all ${annual ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              🔥 Annually <span className="text-xs opacity-80">(30% Off)</span>
            </button>
            <button onClick={() => setAnnual(false)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${!annual ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              Monthly
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.key}
              className={`relative rounded-2xl border p-8 flex flex-col ${plan.popular ? "border-violet-500/50 bg-violet-950/20" : "border-zinc-800 bg-zinc-900/50"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name} Plan</h3>
              <p className="mt-1 text-sm text-zinc-500">{plan.desc}</p>

              <div className="mt-4">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-zinc-500">/mo</span>
                {annual && plan.originalPrice && (
                  <span className="ml-2 text-sm text-zinc-500 line-through">${plan.originalPrice}/mo</span>
                )}
              </div>

              <p className="mt-3 text-sm text-zinc-400">
                {plan.credits}
                <br />Up to {plan.videoCount} or {plan.imageCount}
              </p>

              {/* Features */}
              <ul className="mt-6 space-y-2.5 flex-1">
                {sharedFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" /> {f}
                  </li>
                ))}
                {plan.popular && (
                  <li className="flex items-center gap-2 text-sm text-violet-400">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" /> No ads
                  </li>
                )}
              </ul>

              {plan.popular && (
                <div className="mt-4 rounded-lg bg-violet-600/20 px-3 py-2 text-center text-xs text-violet-300">
                  🎁 Get all credits once with annual fee
                </div>
              )}

              <button onClick={() => handleSubscribe(plan.key)} disabled={paypalLoading !== null}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0070ba] text-sm font-medium text-white hover:bg-[#005ea6] transition-colors disabled:opacity-50">
                {paypalLoading === plan.key ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.323c-.577 0-1.05.423-1.135.995l-.603 3.82c-.072.452-.46.794-.916.794h-.008"/></svg>
                )}
                Subscribe Now →
              </button>
            </div>
          ))}
        </div>

        {/* Credit Packs */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 flex items-center justify-center gap-1">
            <Gift className="h-4 w-4" /> Need a one-time top-up?
          </p>
          <div className="mt-4 flex justify-center gap-4">
            {creditPacks.map((pack) => (
              <button key={pack.credits} onClick={() => handleSubscribe("ADVANCED")}
                disabled={paypalLoading !== null}
                className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-4 hover:border-violet-500/30 transition-all disabled:opacity-50">
                <span className="text-lg font-bold text-white">{pack.credits} Credits</span>
                <span className="text-sm text-zinc-400">${pack.price} One-Time</span>
                <span className="text-xs text-violet-400">Pay →</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings and you won't be charged again." },
            { q: "Do credits expire?", a: "No. Credits roll over each month and never expire as long as your account is active." },
            { q: "What if a generation fails?", a: "Failed generations don't consume credits. You only pay for successful outputs." },
            { q: "Can I use outputs commercially?", a: "Yes. All plans include full commercial license for your generated content." },
            { q: "Is there a free trial?", a: "New users get 20 free credits to try the platform before subscribing." },
          ].map((faq) => (
            <details key={faq.q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 group">
              <summary className="cursor-pointer text-sm font-medium text-white list-none">{faq.q}</summary>
              <p className="mt-2 text-sm text-zinc-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
