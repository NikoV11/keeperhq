"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/content/site";

export function SiteHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black text-brand-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-wide shrink-0">
          KEEPER<span className="text-brand-green-light">HQ</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-gray-300 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/schedule-a-call" className="text-sm text-brand-green-light hover:text-white">
            Schedule a Free Call
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark">
              My Dashboard
            </Link>
          ) : (
            <>
              <Link href="/register" className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold hover:bg-brand-green-dark">
                Register
              </Link>
              <Link href="/login" className="text-sm text-gray-300 hover:text-white">
                Login
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden rounded-lg border border-white/20 px-3 py-1.5 text-sm"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg bg-brand-green px-4 py-2 text-center text-sm font-semibold">
                My Dashboard
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/register" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-brand-green px-4 py-2 text-center text-sm font-semibold">
                  Register
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-center text-sm">
                  Login
                </Link>
              </div>
            )}
            <Link href="/schedule-a-call" onClick={() => setOpen(false)} className="text-sm text-brand-green-light">
              Schedule a Free Call
            </Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm text-gray-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
