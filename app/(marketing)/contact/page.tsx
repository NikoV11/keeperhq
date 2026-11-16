import Link from "next/link";
import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/section";
import { ContactForm } from "./contact-form";
import { getOperatingHours } from "@/lib/content";

export const metadata = { title: "Contact | KeeperHQ" };

export default async function ContactPage() {
  const hours = await getOperatingHours();
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <SectionHeading
            eyebrow="Get In Touch"
            title="Contact KeeperHQ"
            subtitle="Tell us about the goalkeeper and what you're looking for — a coach will get back to you."
          />
          <Suspense fallback={<p className="text-sm text-ink-muted">Loading form...</p>}>
            <ContactForm />
          </Suspense>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[0.875rem] bg-brown-soft p-6">
            <p className="font-semibold text-ink">Prefer to talk?</p>
            <p className="mt-1 text-sm text-ink-muted">
              Book a free Zoom call with a KeeperHQ coach. No purchase required.
            </p>
            <Link href="/schedule-a-call" className="mt-4 inline-block rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-[#ffc23d]">
              Schedule a Free Zoom Call
            </Link>
          </div>
          <div className="rounded-xl border border-line p-6">
            <p className="font-semibold text-ink">Operating hours</p>
            <p className="mt-1 text-sm text-ink-muted">{hours.summary}</p>
            <p className="mt-2 text-sm text-ink-muted">{hours.note}</p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
