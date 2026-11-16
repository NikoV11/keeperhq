import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Section, SectionHeading } from "@/components/section";
import { PackageCards } from "@/components/package-cards";
import { MediaImage } from "@/components/media-image";
import { TestimonialCard } from "@/components/testimonial-card";
import { IntroVideo } from "@/components/intro-video";
import { Hero } from "@/components/hero";
import { CredibilityStrip } from "@/components/credibility-strip";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/button";
import { HOW_IT_WORKS } from "@/content/site";
import { CATEGORY_LABELS } from "@/lib/training-categories";
import {
  getTeamMembers,
  getTestimonials,
  getGoalkeepers,
  getSCPrograms,
  getSiteText,
  getOperatingHours,
} from "@/lib/content";

export default async function HomePage() {
  const supabase = await createClient();

  const [siteText, team, allTestimonials, goalkeepers, scPrograms, hours] =
    await Promise.all([
      getSiteText(),
      getTeamMembers(),
      getTestimonials(),
      getGoalkeepers(),
      getSCPrograms(),
      getOperatingHours(),
    ]);

  const { data: freeVideos } = await supabase
    .from("training_videos")
    .select("id, title, description")
    .eq("is_free_trial", true)
    .eq("published", true)
    .order("sort_order")
    .limit(3);

  const featured = allTestimonials.filter((t) => t.featured).slice(0, 3);
  const corePrograms = scPrograms.filter((p) => p.category === "program");
  const extraPrograms = scPrograms.filter((p) => p.category !== "program");

  return (
    <>
      <Hero
        siteText={siteText}
        goalkeeperCount={goalkeepers.length}
        testimonialCount={allTestimonials.length}
      />

      <CredibilityStrip />

      {/* Introduction video */}
      <Section id="intro">
        <SectionHeading
          eyebrow="Meet KeeperHQ"
          title="Who we are and why we built this"
          subtitle="Our coaches introduce the KeeperHQ philosophy, how the online model works, and exactly what members receive."
        />
        <Reveal className="overflow-hidden rounded-[1.25rem] shadow-[var(--shadow-lg)]">
          <IntroVideo />
        </Reveal>
      </Section>

      {/* How it works */}
      <Section tone="dark">
        <SectionHeading
          dark
          eyebrow="The process"
          title="How KeeperHQ works"
          subtitle="Train, record, get real feedback from a coach, then do it again — a loop that actually moves your game."
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <Reveal as="li" key={item.step} delay={i * 70}>
              <div className="kh-lift group h-full rounded-[0.875rem] border border-white/10 bg-white/[0.04] p-6 hover:border-gold/40">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                  {i + 1}
                </span>
                <p className="font-bold">{item.step}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/65">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Free trial */}
      <Section tone="warm">
        <SectionHeading
          eyebrow="No card required"
          title="Start with a free trial"
          subtitle="Create a free account and get access to selected goalkeeper training videos."
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {(freeVideos && freeVideos.length > 0
            ? freeVideos
            : [
                { id: "p1", title: "Handling", description: "Sample video coming soon." },
                { id: "p2", title: "Movement / Set Position", description: "Sample video coming soon." },
                { id: "p3", title: "Low Diving", description: "Sample video coming soon." },
              ]
          ).map((video, i) => (
            <Reveal key={video.id} delay={i * 80}>
              <div className="kh-lift group h-full overflow-hidden rounded-[0.875rem] border border-line bg-paper">
                <div className="relative grid aspect-video place-items-center bg-ink/[0.04]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-ink shadow-[var(--shadow-gold)] transition-transform duration-300 group-hover:scale-110">
                    <PlayIcon />
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-bold">{video.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{video.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center gap-5">
          <Button href="/register" size="lg">
            Start your free trial
          </Button>
          <p className="text-sm text-ink-muted">
            Ready for more? Unlock the complete training library.
          </p>
        </Reveal>
      </Section>

      {/* Training library */}
      <Section>
        <SectionHeading
          eyebrow="Training library"
          title="Every technical category a goalkeeper needs"
          subtitle="Individual and partner exercises, indoor and outdoor — structured so you always know what to work on next."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(CATEGORY_LABELS).map(([key, label], i) => (
            <Reveal key={key} delay={i * 45}>
              <div className="kh-lift group flex h-full items-start gap-3 rounded-[0.875rem] border border-line bg-paper p-5 hover:border-gold">
                <span
                  aria-hidden
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold transition-transform duration-300 group-hover:scale-150"
                />
                <span className="text-sm font-semibold leading-snug">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/training" className="kh-underline text-sm font-bold text-gold-dark">
            Explore the full training library →
          </Link>
        </Reveal>
      </Section>

      {/* Packages */}
      <Section id="packages" tone="warm">
        <SectionHeading
          center
          eyebrow="Membership"
          title="Choose your KeeperHQ package"
          subtitle="Train on your own, or add individual coach evaluations for personal feedback every month."
        />
        <PackageCards />
      </Section>

      {/* Game video analysis */}
      <Section tone="dark">
        <SectionHeading
          dark
          eyebrow="One-time service"
          title="Individual game video analysis"
          subtitle="A full breakdown of one of your games, reviewed one-to-one with a KeeperHQ coach on Zoom."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <ol className="space-y-1">
            {[
              "Purchase the analysis",
              "Schedule the Zoom session",
              "Upload the full game, or share a link",
              "Submit footage at least 7 days before the call",
              "Your coach reviews and prepares the analysis",
              "Meet one-to-one on Zoom to go through it",
            ].map((step, i) => (
              <Reveal as="li" key={step} delay={i * 55}>
                <div className="flex gap-4 border-b border-white/[0.07] py-3.5">
                  <span className="w-6 shrink-0 text-sm font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-paper/75">{step}</span>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120}>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-8">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">
                What gets analyzed
              </p>
              <p className="mt-3 leading-relaxed text-paper/70">
                Positioning, starting position, decision-making, crosses, covering
                space, distribution, playing with the feet, communication, technique,
                and the key match situations that defined the game.
              </p>
              <Button href="/services" className="mt-7">
                Learn more
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Strength & conditioning */}
      <Section>
        <SectionHeading
          eyebrow="KeeperHQ × TAP"
          title="Strength & conditioning built for goalkeepers"
          subtitle="Goalkeeper-specific physical development with Train.Adapt.Peak — built around the demands of the position."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {corePrograms.map((program, i) => (
            <Reveal key={program.key} delay={i * 70}>
              <div className="kh-lift h-full rounded-[0.875rem] border border-line bg-paper p-6 hover:border-gold">
                <p className="font-bold">{program.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {program.focus}
                </p>
                <p className="mt-4 text-sm font-bold text-gold-dark">
                  {program.price_display}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        {extraPrograms.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {extraPrograms.map((program, i) => (
              <Reveal key={program.key} delay={i * 70}>
                <div className="kh-lift h-full rounded-[0.875rem] bg-brown-soft p-6">
                  <p className="font-bold">{program.title}</p>
                  <p className="mt-1.5 text-sm text-ink-muted">{program.focus}</p>
                  <p className="mt-4 text-sm font-bold text-brown">
                    {program.price_display}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="/strength-conditioning" size="lg">
            View S&C programs
          </Button>
          <Button href="/strength-conditioning/questionnaire" variant="outline" size="lg">
            Find my program
          </Button>
          <span className="rounded-full bg-paper-sunk px-3.5 py-1.5 text-xs font-semibold text-ink-muted">
            Nutrition coming soon
          </span>
        </Reveal>
      </Section>

      {/* Team */}
      {team.length > 0 && (
        <Section tone="warm">
          <SectionHeading eyebrow="About us" title="Meet the KeeperHQ team" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 90}>
                <Link
                  href={`/about/${member.slug}`}
                  className="kh-lift group block h-full overflow-hidden rounded-[1.25rem] border border-line bg-paper"
                >
                  <div className="overflow-hidden">
                    <MediaImage
                      path={member.photo_path}
                      alt={member.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-bold">{member.name}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gold-dark">
                      {member.role_title}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                      {member.short_bio}
                    </p>
                    <span className="mt-4 inline-block text-sm font-bold text-ink group-hover:text-gold-dark">
                      Full profile →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Goalkeepers worked with */}
      {goalkeepers.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Track record"
            title="Goalkeepers we have worked with"
            subtitle="From Olympic and World Cup squads to academy professionals, college starters, and high-school keepers."
          />
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {goalkeepers.slice(0, 6).map((gk, i) => (
              <Reveal key={gk.id} delay={i * 70}>
                <TestimonialCard testimonial={gk} showProfile={false} />
              </Reveal>
            ))}
          </div>
          {goalkeepers.length > 6 && (
            <Reveal className="mt-10">
              <Link
                href="/goalkeepers"
                className="kh-underline text-sm font-bold text-gold-dark"
              >
                See all {goalkeepers.length} goalkeepers →
              </Link>
            </Reveal>
          )}
        </Section>
      )}

      {/* Testimonials */}
      {featured.length > 0 && (
        <Section tone="dark">
          <SectionHeading
            dark
            eyebrow="Testimonials"
            title="Hear it from goalkeepers and coaches"
            subtitle="What the people who have worked with us say."
          />
          <div className="grid items-start gap-5 lg:grid-cols-3">
            {featured.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <TestimonialCard testimonial={t} dark showProfile={false} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <Button href="/testimonials" size="lg">
              Read all {allTestimonials.length} testimonials
            </Button>
          </Reveal>
        </Section>
      )}

      {/* Free call */}
      <Section tone="warm">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-extrabold leading-tight">
              Want to meet us first?
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              Book a free Zoom call. Meet a coach, learn how KeeperHQ works, ask
              anything, and talk through your development goals. No purchase required.
            </p>
            <Button href="/schedule-a-call" size="lg" className="mt-7">
              Schedule your free call
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[1.25rem] border border-line bg-paper p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-dark">
                Operating hours
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                {hours.summary}
                {hours.timezone && <span> ({hours.timezone})</span>}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{hours.note}</p>
              <Button href="/contact" variant="outline" className="mt-5">
                Contact us
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #f8b018 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,5.5vw,3.25rem)] font-extrabold leading-[1.05]">
              Ready to take your goalkeeping to the next level?
            </h2>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-gold">
              {siteText.tagline}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button href="/register" size="lg">
                Start free
              </Button>
              <Button href="/packages" variant="onDark" size="lg">
                View packages
              </Button>
              <Button href="/schedule-a-call" variant="onDark" size="lg">
                Book a free call
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M5 3.5v9l8-4.5-8-4.5Z" />
    </svg>
  );
}
