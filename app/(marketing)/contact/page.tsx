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
          <Suspense fallback={<p className="text-sm text-brand-gray">Loading form...</p>}>
            <ContactForm />
          </Suspense>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl bg-brand-gray-light p-6">
            <p className="font-semibold text-brand-black">Prefer to talk?</p>
            <p className="mt-1 text-sm text-brand-gray">
              Book a free Zoom call with a KeeperHQ coach. No purchase required.
            </p>
            <Link href="/schedule-a-call" className="mt-4 inline-block rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark">
              Schedule a Free Zoom Call
            </Link>
          </div>
          <div className="rounded-xl border border-gray-200 p-6">
            <p className="font-semibold text-brand-black">Operating hours</p>
            <p className="mt-1 text-sm text-brand-gray">{hours.summary}</p>
            <p className="mt-2 text-sm text-brand-gray">{hours.note}</p>
          </div>
        </aside>
      </div>
    </Section>
  );
}
