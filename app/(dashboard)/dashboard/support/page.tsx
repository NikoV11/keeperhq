import Link from "next/link";
import { getOperatingHours } from "@/lib/content";

export default async function SupportPage() {
  const hours = await getOperatingHours();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Support</h1>
        <p className="text-ink-muted">We&apos;re here to help with anything KeeperHQ.</p>
      </div>

      <div className="rounded-[0.875rem] border border-line bg-paper p-6 space-y-3 text-sm">
        <p className="text-ink">
          The KeeperHQ training library is available <strong>24/7</strong>. Live support,
          evaluations, and Zoom sessions run during scheduled availability.
        </p>
        <p className="text-ink-muted">{hours.summary}</p>
        <div className="flex gap-3 pt-2">
          <Link href="/contact" className="rounded-lg bg-gold px-4 py-2 font-bold text-ink hover:bg-[#ffc23d]">
            Contact Us
          </Link>
          <Link href="/schedule-a-call" className="rounded-lg border border-gold px-4 py-2 font-semibold text-gold-dark hover:bg-gold hover:text-ink">
            Schedule a Free Call
          </Link>
        </div>
      </div>
    </div>
  );
}
