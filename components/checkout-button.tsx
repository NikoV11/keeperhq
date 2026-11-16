"use client";

import { useState } from "react";
import type { ProductType } from "@/lib/stripe/products";

export function CheckoutButton({
  productType,
  productKey,
  referralCode,
  variant = "primary",
  className = "",
  children,
}: {
  productType: ProductType;
  productKey: string;
  referralCode?: string;
  variant?: "primary" | "outline";
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType, productKey, referralCode }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-all active:scale-[0.97] disabled:opacity-60 ${
          variant === "primary"
            ? "bg-gold text-ink hover:-translate-y-0.5 hover:bg-[#ffc23d] shadow-[var(--shadow-gold)]"
            : "border border-ink/15 text-ink hover:-translate-y-0.5 hover:border-gold hover:bg-gold-soft"
        } ${className}`}
      >
        {loading ? "Redirecting..." : children}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
