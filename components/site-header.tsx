"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { NAV_LINKS } from "@/content/site";

export function SiteHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Condense the bar once the page moves, so the hero gets full height on arrival.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 text-paper transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-ink"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Logo size="md" className="shrink-0" />

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`kh-underline py-1 text-sm transition-colors ${
                  active ? "font-semibold text-gold" : "text-paper/70 hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/schedule-a-call"
            className="text-sm text-paper/70 transition-colors hover:text-gold"
          >
            Free call
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-[#ffc23d]"
            >
              My dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-paper/70 transition-colors hover:text-paper"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-[#ffc23d]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu — big tap targets, actions first */}
      <div
        className={`overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4 px-5 py-5" onClick={() => setOpen(false)}>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="block rounded-full bg-gold py-3 text-center font-bold text-ink"
            >
              My dashboard
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/register"
                className="rounded-full bg-gold py-3 text-center text-sm font-bold text-ink"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/25 py-3 text-center text-sm font-semibold"
              >
                Login
              </Link>
            </div>
          )}
          <Link
            href="/schedule-a-call"
            className="block rounded-full border border-gold/40 py-3 text-center text-sm font-semibold text-gold"
          >
            Schedule a free call
          </Link>
          <div className="grid gap-0.5 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm text-paper/75 transition-colors hover:bg-white/5 hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
