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
      className="rounded-lg border border-gold px-4 py-2 text-sm font-semibold text-gold-dark hover:bg-gold hover:text-ink disabled:opacity-60"
    >
      {loading ? "Opening..." : "Manage Billing"}
    </button>
  );
}
