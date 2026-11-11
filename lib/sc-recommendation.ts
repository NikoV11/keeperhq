export type QuestionnaireInput = {
  gkLevel: "youth" | "high_school" | "college" | "semi_pro" | "pro";
  injuryFlags: string[];
  equipment: string[];
  weeklyTrainingDays: number;
};

export const SC_RECOMMENDATION_LABELS: Record<string, string> = {
  sc_strong: "Strong GK",
  sc_fit: "Fit GK",
  sc_explosive: "Explosive GK",
  sc_powerful: "Powerful GK",
};

export function recommendProgram(input: QuestionnaireInput): string {
  const { gkLevel, injuryFlags, equipment, weeklyTrainingDays } = input;

  // Anyone carrying a current injury starts with foundational strength and movement
  // quality rather than high-intensity power work.
  if (injuryFlags.includes("current_injury")) {
    return "sc_strong";
  }

  if (weeklyTrainingDays <= 2) {
    return "sc_fit";
  }

  const hasGymAccess = equipment.includes("gym") || equipment.includes("barbell");
  const advancedLevel = gkLevel === "semi_pro" || gkLevel === "pro";

  if (advancedLevel && hasGymAccess) {
    return "sc_powerful";
  }

  if (gkLevel === "youth" || gkLevel === "high_school") {
    return hasGymAccess ? "sc_strong" : "sc_explosive";
  }

  return hasGymAccess ? "sc_strong" : "sc_explosive";
}
