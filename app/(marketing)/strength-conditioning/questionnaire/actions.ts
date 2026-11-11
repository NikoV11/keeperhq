"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveQuestionnaireAction(input: {
  gkLevel: string;
  equipment: string[];
  injuryFlags: string[];
  weeklyTrainingDays: number;
  recommended: string;
}): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { saved: false };

  const { error } = await supabase.from("sc_questionnaire_responses").insert({
    user_id: user.id,
    gk_level: input.gkLevel,
    equipment: input.equipment,
    injury_flags: input.injuryFlags,
    weekly_training_days: input.weeklyTrainingDays,
    recommended_program: input.recommended,
  });

  return { saved: !error };
}
