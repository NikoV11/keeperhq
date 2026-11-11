import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/section";
import { PackageCards } from "@/components/package-cards";
import { SITE, HOW_IT_WORKS, TRAINING_CATEGORIES, OPERATING_HOURS } from "@/content/site";
import { TEAM } from "@/content/team";
import { VIDEO_TESTIMONIALS, WRITTEN_TESTIMONIALS, GOALKEEPERS } from "@/content/testimonials";
import { SC_PROGRAMS, SC_BUNDLE, SC_CUSTOM } from "@/content/sc-programs";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: freeVideos } = await supabase
    .from("training_videos")
    .select("id, title, description")
    .eq("is_free_trial", true)
    .eq("published", true)
    .order("sort_order")
    .limit(3);

  const featuredTestimonials = VIDEO_TESTIMONIALS.filter((t) => t.featured).slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-brand-black text-brand-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            KEEPER<span className="text-brand-green-light">HQ</span>
          </h1>
          <p className="mt-3 text-lg font-semibold uppercase tracking-[0.2em] text-brand-green-light sm:text-xl">
            {SITE.tagline}
          </p>
          <p className="mt-6 max-w-2xl text-gray-300">{SITE.description}</p>
          <p className="mt-4 max-w-2xl font-medium">{SITE.cta}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold hover:bg-brand-green-dark">
              START FREE TRIAL
            </Link>
            <Link href="/packages" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              VIEW PACKAGES
            </Link>
            <Link href="/schedule-a-call" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              SCHEDULE A FREE ZOOM CALL
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Introduction video */}
      <Section>
        <SectionHeading
          eyebrow="Meet KeeperHQ"
          title="Who we are and why we built this"
          subtitle="Stefan and Jack introduce the KeeperHQ coaching philosophy, how the online model works, and exactly what members receive."
        />
        <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-brand-gray-light">
          <div className="flex h-full items-center justify-center text-sm text-brand-gray">
            Introduction video coming soon.
          </div>
        </div>
      </Section>

      {/* 3. How KeeperHQ Works */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="The Process"
          title="How KeeperHQ Works"
          subtitle="Train → Record → Evaluate → Improve → Repeat."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <li key={item.step} className="rounded-xl bg-white/5 p-5">
              <p className="text-xs font-bold text-brand-green-light">STEP {i + 1}</p>
              <p className="mt-1 font-semibold">{item.step}</p>
              <p className="mt-1 text-sm text-gray-300">{item.detail}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Free Trial */}
      <Section>
        <SectionHeading
          eyebrow="No Card Required"
          title="Start with a free trial"
          subtitle="Create a free account and get access to selected goalkeeper training videos — handling, movement and set position, and low diving."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {(freeVideos && freeVideos.length > 0
            ? freeVideos
            : [
                { id: "p1", title: "Handling", description: "Sample video coming soon." },
                { id: "p2", title: "Movement / Set Position", description: "Sample video coming soon." },
                { id: "p3", title: "Low Diving", description: "Sample video coming soon." },
              ]
          ).map((video) => (
            <div key={video.id} className="rounded-xl border border-gray-200 p-5">
              <div className="mb-3 aspect-video rounded-lg bg-brand-gray-light" />
              <p className="font-semibold">{video.title}</p>
              <p className="mt-1 text-sm text-brand-gray">{video.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/register" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            START YOUR FREE TRIAL
          </Link>
          <p className="text-sm text-brand-gray">
            Ready for more? Unlock the complete KeeperHQ training library.
          </p>
        </div>
      </Section>

      {/* 5. Training Library */}
      <Section className="bg-brand-gray-light">
        <SectionHeading
          eyebrow="Training Library"
          title="Every technical category a goalkeeper needs"
          subtitle="Individual and partner exercises, indoor and outdoor — structured so you always know what to work on next."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINING_CATEGORIES.map((cat) => (
            <div key={cat.key} className="rounded-xl bg-white p-4 text-sm font-medium shadow-sm">
              {cat.label}
            </div>
          ))}
        </div>
        <Link href="/training" className="mt-8 inline-block text-sm font-semibold text-brand-green">
          Explore the full training library &rarr;
        </Link>
      </Section>

      {/* 6. Packages */}
      <Section id="packages">
        <SectionHeading
          eyebrow="Membership"
          title="Choose your KeeperHQ package"
          subtitle="Train on your own, or add individual coach evaluations for personal feedback every month."
        />
        <PackageCards />
      </Section>

      {/* 7. Game Video Analysis */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="One-Time Service"
          title="Individual Game Video Analysis"
          subtitle="$39.99 — a full breakdown of one of your games, reviewed 1-on-1 with a KeeperHQ coach on Zoom."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <ol className="space-y-3">
            {[
              "Purchase the analysis",
              "Schedule the Zoom session",
              "Upload the complete game or provide a full-game link",
              "Submit the footage at least 7 days before the scheduled Zoom",
              "A KeeperHQ coach reviews and prepares the analysis",
              "Meet individually on Zoom to discuss the game",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="shrink-0 font-bold text-brand-green-light">{i + 1}.</span>
                <span className="text-gray-300">{step}</span>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-white/5 p-6">
            <p className="text-sm font-semibold">What gets analyzed</p>
            <p className="mt-2 text-sm text-gray-300">
              Positioning, starting position, decision-making, crosses, covering space,
              distribution, playing with the feet, communication, technique, and the key
              match situations that defined the game.
            </p>
            <Link href="/services" className="mt-5 inline-block rounded-lg bg-brand-green px-5 py-2.5 text-sm font-semibold hover:bg-brand-green-dark">
              Learn More
            </Link>
          </div>
        </div>
      </Section>

      {/* 8. Strength & Conditioning */}
      <Section>
        <SectionHeading
          eyebrow="KeeperHQ x TAP"
          title="Strength & Conditioning built for goalkeepers"
          subtitle="Goalkeeper-specific physical development with Paul Olla and Train.Adapt.Peak."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SC_PROGRAMS.map((program) => (
            <div key={program.key} className="rounded-xl border border-gray-200 p-5">
              <p className="font-semibold">{program.title}</p>
              <p className="mt-1 text-sm text-brand-gray">{program.focus}</p>
              <p className="mt-2 text-sm font-medium">{program.priceRange}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-brand-gray-light p-5">
            <p className="font-semibold">{SC_BUNDLE.title}</p>
            <p className="mt-1 text-sm text-brand-gray">{SC_BUNDLE.focus}</p>
            <p className="mt-2 text-sm font-medium">{SC_BUNDLE.priceRange}</p>
          </div>
          <div className="rounded-xl bg-brand-gray-light p-5">
            <p className="font-semibold">{SC_CUSTOM.title}</p>
            <p className="mt-1 text-sm text-brand-gray">{SC_CUSTOM.focus}</p>
            <p className="mt-2 text-sm font-medium">
              {SC_CUSTOM.priceRangeOneTime} or {SC_CUSTOM.priceRangeMonthly}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/strength-conditioning" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            View S&C Programs
          </Link>
          <Link href="/strength-conditioning/questionnaire" className="rounded-lg border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white">
            Find My Program
          </Link>
        </div>
        <p className="mt-6 text-sm text-brand-gray">
          <span className="font-semibold text-brand-black">Coming soon:</span> KeeperHQ x TAP
          Goalkeeper Nutrition.
        </p>
      </Section>

      {/* 9. Meet the Team */}
      <Section className="bg-brand-gray-light">
        <SectionHeading eyebrow="About Us" title="Meet the KeeperHQ team" />
        <div className="grid gap-6 sm:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.slug} className="rounded-xl bg-white p-5 shadow-sm">
              <Image
                src={member.photoPath}
                alt={member.name}
                width={400}
                height={400}
                className="mb-4 aspect-square w-full rounded-lg object-cover"
              />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-brand-green">{member.role}</p>
              <p className="mt-2 text-sm text-brand-gray">{member.shortBio}</p>
              <Link href={`/about/${member.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand-green">
                Full Profile &rarr;
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Goalkeepers We've Worked With */}
      <Section>
        <SectionHeading
          eyebrow="Track Record"
          title="Goalkeepers we have worked with"
          subtitle="Real goalkeepers, real levels, real development."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOALKEEPERS.map((gk) => (
            <div key={gk.id} className="rounded-xl border border-gray-200 p-4">
              <Image
                src={gk.photoPath}
                alt={gk.name}
                width={400}
                height={400}
                className="mb-3 aspect-square w-full rounded-lg object-cover"
              />
              <p className="font-semibold">{gk.name}</p>
              <p className="text-sm text-brand-gray">{gk.affiliation}</p>
              <p className="text-sm text-brand-gray">{gk.level}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 11. Video Testimonials */}
      <Section dark>
        <SectionHeading
          dark
          eyebrow="Testimonials"
          title="Hear it from our goalkeepers"
          subtitle="Goalkeepers and parents on what training with KeeperHQ changed for them."
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {featuredTestimonials.map((t) => (
            <div key={t.id} className="rounded-xl bg-white/5 p-5">
              <div className="mb-3 aspect-video rounded-lg bg-white/10" />
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-400">{t.affiliation}</p>
              {t.quote && <p className="mt-2 text-sm text-gray-300">&ldquo;{t.quote}&rdquo;</p>}
              <button
                disabled
                className="mt-3 rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-gray-400"
              >
                WATCH TESTIMONIAL
              </button>
            </div>
          ))}
        </div>
        <Link href="/testimonials" className="mt-8 inline-block rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold hover:bg-brand-green-dark">
          VIEW ALL TESTIMONIALS
        </Link>
      </Section>

      {/* 12. Written Testimonials */}
      <Section>
        <SectionHeading title="In their own words" subtitle="Prefer to read? Here's what families tell us." />
        <div className="grid gap-4 sm:grid-cols-2">
          {WRITTEN_TESTIMONIALS.map((t) => (
            <blockquote key={t.id} className="rounded-xl bg-brand-gray-light p-6">
              <p className="text-sm text-brand-black">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-3 text-sm font-semibold">
                {t.name}
                <span className="font-normal text-brand-gray"> — {t.affiliation}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* 13. Free Zoom Call */}
      <Section className="bg-brand-gray-light">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Want to meet us first?</h2>
          <p className="mt-3 text-brand-gray">
            Schedule a free KeeperHQ Zoom call. Meet a coach, learn how KeeperHQ works,
            understand the memberships and services, ask questions, and discuss your
            goalkeeper-development goals. No purchase required.
          </p>
          <Link href="/schedule-a-call" className="mt-6 inline-block rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            SCHEDULE YOUR FREE CALL
          </Link>
        </div>
      </Section>

      {/* 14. Contact */}
      <Section>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Questions about KeeperHQ?"
          subtitle="Send us a message and a coach will get back to you — or use the chat button in the corner."
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark">
            Contact Us
          </Link>
          <Link href="/schedule-a-call" className="rounded-lg border border-brand-green px-6 py-3 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white">
            Prefer to talk? Schedule a Free Zoom Call
          </Link>
        </div>
      </Section>

      {/* 15. Operating Hours */}
      <Section className="bg-brand-gray-light">
        <SectionHeading title="Operating hours" />
        <p className="text-brand-gray">{OPERATING_HOURS.summary}</p>
        <p className="mt-2 text-brand-gray">{OPERATING_HOURS.note}</p>
      </Section>

      {/* 16. Final CTA */}
      <Section dark>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Ready to take your goalkeeping game to the next level?
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-green-light">
            {SITE.tagline}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="rounded-lg bg-brand-green px-6 py-3 text-sm font-semibold hover:bg-brand-green-dark">
              START FREE
            </Link>
            <Link href="/packages" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              VIEW PACKAGES
            </Link>
            <Link href="/schedule-a-call" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              SCHEDULE A FREE CALL
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
