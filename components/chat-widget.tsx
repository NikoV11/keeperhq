"use client";

import { useState } from "react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
        gk_age: formData.get("gk_age"),
        country: formData.get("country"),
        message: formData.get("message"),
        source: "chat_widget",
      }),
    });

    setPending(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError("Couldn't send your message. Please try again or use the contact page.");
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl bg-white p-5 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <p className="font-semibold text-brand-black">Thanks — message sent.</p>
              <p className="mt-1 text-sm text-brand-gray">A KeeperHQ coach will get back to you soon.</p>
              <button onClick={() => setOpen(false)} className="mt-4 text-sm font-medium text-brand-green">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="font-semibold text-brand-black">Questions? Chat with us.</p>
              <input name="name" placeholder="Your name" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none" />
              <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none" />
              <div className="flex gap-2">
                <input name="gk_age" type="number" min={4} max={60} placeholder="GK age" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none" />
                <input name="country" placeholder="Country" className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none" />
              </div>
              <textarea name="message" placeholder="How can we help?" rows={3} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand-green py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60">
                {pending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-brand-green-dark"
        aria-expanded={open}
      >
        {open ? "Close" : "Questions? Chat With Us"}
      </button>
    </>
  );
}
