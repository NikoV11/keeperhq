export type SCProgram = {
  key: string;
  title: string;
  focus: string;
  priceRange: string;
};

// Pricing is TBD with TAP — ranges reflect the blueprint, update once finalized.
export const SC_PROGRAMS: SCProgram[] = [
  { key: "sc_explosive", title: "Explosive GK", focus: "Reactive power, jumping, and diving explosiveness.", priceRange: "$25–$40" },
  { key: "sc_fit", title: "Fit GK", focus: "Conditioning, work capacity, and movement quality.", priceRange: "$25–$40" },
  { key: "sc_strong", title: "Strong GK", focus: "Foundational full-body strength.", priceRange: "$25–$40" },
  { key: "sc_powerful", title: "Powerful GK", focus: "Advanced power expression and speed-strength.", priceRange: "$25–$40" },
];

export const SC_BUNDLE = {
  key: "sc_bundle",
  title: "All 4 GK Programs",
  focus: "The complete bundle.",
  priceRange: "$75–$100",
};

export const SC_CUSTOM = {
  key: "sc_custom",
  title: "Personalized / Custom Plan",
  focus: "An individualized plan based on your athlete intake, with ongoing check-ins.",
  priceRangeOneTime: "$75–$150 one-time",
  priceRangeMonthly: "$40–$60/month",
};
