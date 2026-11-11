export type LegalDoc = {
  slug: string;
  title: string;
  body: string[];
};

// PLACEHOLDER CONTENT — all legal text below is a structural stand-in and has NOT been
// reviewed by a lawyer. Replace each `body` with the final approved text before launch.
const PLACEHOLDER_NOTICE =
  "This document is a placeholder. The final KeeperHQ policy text is pending legal review and will be published here before launch.";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms & Conditions",
    body: [
      PLACEHOLDER_NOTICE,
      "These terms will cover acceptable use of the KeeperHQ platform, membership obligations, intellectual property in the training library, and the conditions under which accounts may be suspended.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    body: [
      PLACEHOLDER_NOTICE,
      "This policy will describe what personal data KeeperHQ collects (including data about minors and parent/guardian details), how uploaded training footage is stored and who can access it, the third-party processors involved, and how to request deletion of your data.",
    ],
  },
  {
    slug: "waiver",
    title: "Liability Waiver",
    body: [
      PLACEHOLDER_NOTICE,
      "This waiver will cover the physical risks inherent in goalkeeper training and strength and conditioning work, the requirement to train within your own physical limits, and the recommendation to obtain medical clearance before beginning any program.",
    ],
  },
  {
    slug: "cancellation",
    title: "Cancellation Policy",
    body: [
      PLACEHOLDER_NOTICE,
      "This policy will set out how to cancel a Bronze, Silver, or Gold membership, when cancellation takes effect relative to the billing period, and how to reschedule or cancel a booked Zoom evaluation.",
    ],
  },
  {
    slug: "refunds",
    title: "Refund Policy",
    body: [
      PLACEHOLDER_NOTICE,
      "This policy will set out the circumstances in which membership payments, Game Video Analysis purchases, and Strength & Conditioning program purchases may be refunded.",
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    body: [
      PLACEHOLDER_NOTICE,
      "This policy will describe the cookies KeeperHQ uses, including the session cookies required for login and any analytics cookies, and how to manage them.",
    ],
  },
];

export function getLegalDoc(slug: string) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}
