import { createClient } from "@/lib/supabase/server";
import { createPlanAction, toggleItemDoneAction } from "./actions";

export default async function TrainingPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("training_plans")
    .select("id, title, notes, training_plan_items(id, sort_order, done, training_videos(title))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Training Plan</h1>
        <p className="text-ink-muted">A curated set of exercises to work through.</p>
      </div>

      <form action={createPlanAction} className="flex gap-2 rounded-[0.875rem] bg-paper p-4 shadow-sm">
        <input
          name="title"
          placeholder="New plan title (e.g. Week 1 — Diving Foundations)"
          required
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-[#ffc23d]">
          Create Plan
        </button>
      </form>

      {!plans || plans.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No plans yet. Your coach can also assign one for you after an evaluation.
        </p>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="rounded-[0.875rem] border border-line bg-paper p-5">
            <h2 className="font-semibold text-ink">{plan.title}</h2>
            {plan.notes && <p className="mt-1 text-sm text-ink-muted">{plan.notes}</p>}
            <ul className="mt-3 space-y-2">
              {(plan.training_plan_items ?? []).map((item) => {
                const video = item.training_videos as unknown as { title: string } | null;
                return (
                  <li key={item.id} className="flex items-center gap-2 text-sm">
                    <form action={toggleItemDoneAction}>
                      <input type="hidden" name="item_id" value={item.id} />
                      <input type="hidden" name="done" value={String(!item.done)} />
                      <button type="submit" aria-label="Toggle done">
                        {item.done ? "✅" : "⬜️"}
                      </button>
                    </form>
                    <span className={item.done ? "line-through text-ink-muted" : "text-ink"}>
                      {video?.title ?? "Video"}
                    </span>
                  </li>
                );
              })}
              {(!plan.training_plan_items || plan.training_plan_items.length === 0) && (
                <li className="text-sm text-ink-muted">
                  No videos added yet — add some from the Training Library.
                </li>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
