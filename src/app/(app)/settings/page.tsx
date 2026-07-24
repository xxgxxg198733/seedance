"use client";

import { useEffect, useState } from "react";
import { Settings, User, CreditCard, Bell, Zap, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const [billing, setBilling] = useState<{ credits: number; plan: string }>({ credits: 20, plan: "FREE" });

  useEffect(() => {
    fetch("/api/credits").then(r => r.json()).then(setBilling).catch(() => {});
  }, []);

  const checkout = async (plan: string) => {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
  };

  return (
    <div className="flex h-full flex-col p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-8">
        <Settings className="h-6 w-6 text-violet-400" /> Settings
      </h1>

      <div className="space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <User className="h-4 w-4" /> Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/30 text-xl font-bold text-violet-300">U</div>
            <div>
              <p className="text-white font-medium">User</p>
              <p className="text-sm text-zinc-500">user@example.com</p>
              <p className="text-xs text-zinc-600 mt-1">{billing.plan} Plan · {billing.credits} credits</p>
            </div>
          </div>
        </section>

        {/* Plan & Billing */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4" /> Plan & Billing
          </h2>

          <div className="rounded-xl bg-gradient-to-r from-violet-950/50 to-purple-950/50 border border-violet-500/20 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{billing.plan} Plan</p>
                <p className="text-sm text-zinc-400">{billing.credits} credits remaining</p>
              </div>
              <span className="rounded-full bg-violet-600/30 px-3 py-1 text-xs font-medium text-violet-300">
                {billing.plan === "FREE" ? "Trial" : "Active"}
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { plan: "LITE", label: "Lite", price: "$10/mo", credits: "200/mo" },
              { plan: "PRO", label: "Pro", price: "$25/mo", credits: "600/mo" },
              { plan: "PREMIUM", label: "Premium", price: "$119/mo", credits: "3,000/mo" },
            ].map((p) => (
              <button key={p.plan} onClick={() => checkout(p.plan)}
                className="flex flex-col items-center rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 hover:border-violet-500/30 transition-all">
                <span className="text-sm font-semibold text-white">{p.label}</span>
                <span className="text-xs text-zinc-400">{p.price}</span>
                <span className="text-xs text-zinc-500">{p.credits}</span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-violet-400">
                  <Zap className="h-3 w-3" /> Upgrade
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4" /> Notifications
          </h2>
          <p className="text-sm text-zinc-500">Configure email notifications for generation completion, billing updates, and product news.</p>
        </section>

        {/* Stripe Portal */}
        <div className="pt-4 border-t border-zinc-800">
          <a href="#" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
            <ExternalLink className="h-4 w-4" /> Manage billing in Stripe Customer Portal
          </a>
        </div>
      </div>
    </div>
  );
}
