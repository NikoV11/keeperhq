import Link from "next/link";
import { SITE, FOOTER_LINKS, LEGAL_LINKS, OPERATING_HOURS, SOCIAL_LINKS, CONTACT_EMAIL } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-brand-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-brand-white">
              KEEPER<span className="text-brand-green-light">HQ</span>
            </p>
            <p className="mt-2 text-sm">{SITE.tagline}</p>
            <p className="mt-4 text-sm">{CONTACT_EMAIL}</p>
            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-3 flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.href} href={s.href} className="text-sm hover:text-white">{s.label}</a>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-white">Explore</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-white">Legal</p>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-white">Operating Hours</p>
            <p className="mt-3 text-sm">{OPERATING_HOURS.summary}</p>
            <p className="mt-2 text-sm text-gray-400">{OPERATING_HOURS.note}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} KeeperHQ. {SITE.tagline}
        </div>
      </div>
    </footer>
  );
}
