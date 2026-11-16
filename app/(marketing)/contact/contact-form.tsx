"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const INTERESTS = [
  { value: "bronze", label: "Bronze Membership" },
  { value: "silver", label: "Silver Membership" },
  { value: "gold", label: "Gold Membership" },
  { value: "game_analysis", label: "Game Video Analysis" },
  { value: "sc", label: "Strength & Conditioning" },
  { value: "free_trial", label: "Free Trial" },
  { value: "general", label: "General Question" },
];

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none";

export function ContactForm() {
  const searchParams = useSearchParams();
  const presetInterest = searchParams.get("interest") ?? "general";
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        gk_age: formData.get("gk_age") || null,
        country: formData.get("country"),
        club_school: formData.get("club_school"),
        playing_level: formData.get("playing_level"),
        interest: formData.get("interest"),
        message: formData.get("message"),
        source: "contact_page",
      }),
    });

    setPending(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError("Couldn't send your message. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-gold p-8">
        <p className="font-semibold text-ink">Thanks — your message is on its way.</p>
        <p className="mt-1 text-sm text-ink-muted">
          A KeeperHQ coach will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input name="name" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Goalkeeper age</label>
          <input name="gk_age" type="number" min={4} max={80} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Country</label>
          <input name="country" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Current club / school</label>
          <input name="club_school" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Playing level</label>
          <input name="playing_level" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Service of interest</label>
        <select name="interest" defaultValue={presetInterest} className={inputClass}>
          {INTERESTS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea name="message" rows={5} required className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-ink hover:bg-[#ffc23d] disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
