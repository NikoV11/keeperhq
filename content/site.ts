// Structural site content only. Everything a client would want to edit — taglines,
// prices, bios, testimonials, operating hours, legal text — lives in the database and
// is managed from /admin. See lib/content.ts for those readers.

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Services" },
  { href: "/strength-conditioning", label: "Strength & Conditioning" },
  { href: "/about", label: "About Us" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/training", label: "Training" },
  { href: "/packages", label: "Packages" },
  { href: "/services", label: "Video Analysis" },
  { href: "/strength-conditioning", label: "S&C" },
  { href: "/about", label: "About Us" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/waiver", label: "Liability Waiver" },
  { href: "/legal/cancellation", label: "Cancellation Policy" },
  { href: "/legal/refunds", label: "Refund Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

export const HOW_IT_WORKS = [
  { step: "Choose", detail: "Select a membership or individual service." },
  { step: "Train", detail: "Use the KeeperHQ technical training library." },
  { step: "Record", detail: "Silver and Gold members record selected exercises." },
  { step: "Upload", detail: "Submit selected training clips before the evaluation." },
  { step: "Get Feedback", detail: "Receive individual coaching feedback." },
  { step: "Improve", detail: "Apply the feedback and repeat the process." },
];
