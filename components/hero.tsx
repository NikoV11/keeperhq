import Image from "next/image";
import { Button } from "@/components/button";
import { CountUp } from "@/components/count-up";
import type { SiteText } from "@/lib/content";

export function Hero({
  siteText,
  goalkeeperCount,
  testimonialCount,
}: {
  siteText: SiteText;
  goalkeeperCount: number;
  testimonialCount: number;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Depth: a warm gold bloom behind the badge, and the six-yard box geometry
          from the blueprint rendered as faint linework rather than a busy texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[90px] sm:left-[62%] sm:top-[-10%]"
        style={{ background: "radial-gradient(circle, #f8b018 0%, transparent 70%)" }}
      />
      <PitchLines />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div>
          <p className="kh-rise mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/80 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-70" />
            </span>
            Online goalkeeper development
          </p>

          <h1
            className="kh-rise text-[clamp(1.85rem,7vw,4.5rem)] font-extrabold leading-[1.02] sm:leading-[0.98]"
            style={{ animationDelay: "80ms" }}
          >
            Develop your game.
            <br />
            <span className="text-gold">Anywhere. Anytime.</span>
          </h1>

          <p
            className="kh-rise mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {siteText.hero_description}
          </p>

          <div
            className="kh-rise mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button href="/register" size="lg">
              Start free trial
            </Button>
            <Button href="/packages" variant="onDark" size="lg">
              View packages
            </Button>
            <Button href="/schedule-a-call" variant="onDark" size="lg">
              Book a free call
            </Button>
          </div>

          <dl
            className="kh-rise mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:gap-4 sm:pt-7"
            style={{ animationDelay: "320ms" }}
          >
            <Stat value={goalkeeperCount} suffix="+" label="Goalkeepers coached" />
            <Stat value={testimonialCount} label="References & testimonials" />
            <Stat value={24} suffix="/7" label="Training library access" />
          </dl>
        </div>

        {/* The badge, framed so it reads as a crest rather than a floating logo */}
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-gold/10 blur-2xl"
          />
          <Image
            src="/images/brand/logo-badge.png"
            alt=""
            width={520}
            height={520}
            priority
            className="kh-pop mx-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
            style={{ animationDelay: "200ms" }}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-2xl font-extrabold text-gold sm:text-3xl">
          <CountUp value={value} suffix={suffix} />
        </span>
        <span className="mt-1 block text-[10px] uppercase leading-tight tracking-[0.12em] text-paper/55 sm:text-xs">
          {label}
        </span>
      </dd>
    </div>
  );
}

function PitchLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-paper/[0.05]"
      viewBox="0 0 1200 220"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* six-yard box */}
      <path d="M430 220V96h340v124" stroke="currentColor" strokeWidth="2" />
      {/* penalty area */}
      <path d="M250 220V26h700v194" stroke="currentColor" strokeWidth="2" />
      {/* penalty arc */}
      <path d="M520 26a80 80 0 0 0 160 0" stroke="currentColor" strokeWidth="2" />
      {/* spot */}
      <circle cx="600" cy="150" r="3.5" fill="currentColor" />
    </svg>
  );
}
