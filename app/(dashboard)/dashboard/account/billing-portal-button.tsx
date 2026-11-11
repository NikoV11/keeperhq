"use client";

import { useState } from "react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-lg border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white disabled:opacity-60"
    >
      {loading ? "Opening..." : "Manage Billing"}
    </button>
  );
}
