export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  photoPath: string;
  cvPath: string | null;
  calUsernameEnv?: string;
  sections: { heading: string; body: string }[];
  languages?: string[];
};

// PLACEHOLDER CONTENT — final bios, photos, CVs, and references pending per the
// blueprint's "Materials Still to Add" list. Swap the values here; no code changes needed.
export const TEAM: TeamMember[] = [
  {
    slug: "stefan",
    name: "Stefan Schenk",
    role: "General Manager | Goalkeeper Coach",
    shortBio:
      "Goalkeeper coach and General Manager of KeeperHQ, focused on structured technical development for goalkeepers at every level.",
    photoPath: "/images/placeholder/team-stefan.svg",
    cvPath: null,
    calUsernameEnv: "NEXT_PUBLIC_CALCOM_STEFAN",
    languages: ["English"],
    sections: [
      { heading: "About", body: "Full bio pending — to be supplied before launch." },
      { heading: "Playing Career", body: "Playing career details pending." },
      { heading: "Coaching Career", body: "Coaching career details pending." },
      { heading: "Education", body: "Education details pending." },
      { heading: "Qualifications & Certifications", body: "Qualifications pending." },
      { heading: "Achievements", body: "Achievements pending." },
      { heading: "References", body: "References pending approval." },
    ],
  },
  {
    slug: "jack",
    name: "Jack",
    role: "CEO | Goalkeeper Coach",
    shortBio:
      "Co-founder and CEO of KeeperHQ, bringing the goalkeeper-specific coaching philosophy behind the platform.",
    photoPath: "/images/placeholder/team-jack.svg",
    cvPath: null,
    calUsernameEnv: "NEXT_PUBLIC_CALCOM_JACK",
    languages: ["English"],
    sections: [
      { heading: "About", body: "Full bio and surname pending — to be supplied before launch." },
      { heading: "Playing Career", body: "Playing career details pending." },
      { heading: "Coaching Career", body: "Coaching career details pending." },
      { heading: "Education & Qualifications", body: "Education and qualifications pending." },
      { heading: "References", body: "References pending approval." },
    ],
  },
  {
    slug: "paul",
    name: "Paul Olla",
    role: "Strength & Conditioning | Train.Adapt.Peak",
    shortBio:
      "Strength and conditioning coach behind Train.Adapt.Peak (TAP), delivering goalkeeper-specific physical development for KeeperHQ.",
    photoPath: "/images/placeholder/team-paul.svg",
    cvPath: null,
    calUsernameEnv: "NEXT_PUBLIC_CALCOM_PAUL",
    sections: [
      { heading: "About", body: "Full bio pending — to be supplied before launch." },
      { heading: "Certifications", body: "S&C certifications pending." },
      { heading: "S&C / Athletic Experience", body: "Experience details pending." },
    ],
  },
];

export function getTeamMember(slug: string) {
  return TEAM.find((m) => m.slug === slug);
}
