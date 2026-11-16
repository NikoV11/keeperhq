import Link from "next/link";
import { Logo } from "@/components/logo";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/content/site";
import { getSiteText, getOperatingHours, getSocialLinks } from "@/lib/content";

export async function SiteFooter() {
  const [siteText, hours, social] = await Promise.all([
    getSiteText(),
    getOperatingHours(),
    getSocialLinks(),
  ]);

  return (
    <footer className="bg-brand-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo size="md" className="text-brand-white" />
            <p className="mt-2 text-sm">{siteText.tagline}</p>
            {siteText.contact_email && (
              <a
                href={`mailto:${siteText.contact_email}`}
                className="mt-4 block text-sm hover:text-white"
              >
                {siteText.contact_email}
              </a>
            )}
            {social.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white"
                  >
                    {s.label}
                  </a>
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
            <p className="mt-3 text-sm">
              {hours.summary}
              {hours.timezone && <span> ({hours.timezone})</span>}
            </p>
            <p className="mt-2 text-sm text-gray-400">{hours.note}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} KeeperHQ. {siteText.tagline}
        </div>
      </div>
    </footer>
  );
}
