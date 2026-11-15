// Categories are constrained by a CHECK on training_videos.category, so they live in
// code rather than being admin-editable.
export const CATEGORY_LABELS: Record<string, string> = {
  handling: "Handling & Scoop Technique",
  set_position: "Set Position, Movement & Footwork",
  diving: "Collapse Dive & Low Dive",
  crosses: "Crosses, Covering Crosses & Covering Space",
  distribution: "Distribution, Rolling & Long Throws",
  passing: "Inside-Foot, One-Touch & Two-Touch Passing",
  indoor: "Indoor / Home Exercises",
  outdoor: "Outdoor Exercises",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const SUB_TYPE_OPTIONS = [
  { value: "individual", label: "Individual exercise" },
  { value: "partner", label: "Partner exercise" },
];
