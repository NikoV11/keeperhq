import Link from "next/link";
import { getOperatingHours } from "@/lib/content";

export default async function SupportPage() {
  const hours = await getOperatingHours();
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Support</h1>
        <p className="text-brand-gray">We&apos;re here to help with anything KeeperHQ.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm space-y-3 text-sm">
        <p className="text-brand-black">
          The KeeperHQ training library is available <strong>24/7</strong>. Live support,
          evaluations, and Zoom sessions run during scheduled availability.
        </p>
        <p className="text-brand-gray">{hours.summary}</p>
        <div className="flex gap-3 pt-2">
          <Link href="/contact" className="rounded-lg bg-brand-green px-4 py-2 font-semibold text-white hover:bg-brand-green-dark">
            Contact Us
          </Link>
          <Link href="/schedule-a-call" className="rounded-lg border border-brand-green px-4 py-2 font-semibold text-brand-green hover:bg-brand-green hover:text-white">
            Schedule a Free Call
          </Link>
        </div>
      </div>
    </div>
  );
}
