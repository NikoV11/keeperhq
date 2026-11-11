import { createClient } from "@/lib/supabase/server";

export type Plan = "none" | "bronze" | "silver" | "gold";

export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.plan as Plan) ?? "none";
}

export const EVALUATIONS_PER_MONTH: Record<Plan, number> = {
  none: 0,
  bronze: 0,
  silver: 1,
  gold: 2,
};

export const MAX_CLIPS_PER_EVALUATION = 3;
