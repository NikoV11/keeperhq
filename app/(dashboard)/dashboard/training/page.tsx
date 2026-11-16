import { createClient } from "@/lib/supabase/server";
import { toggleFavoriteAction } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  handling: "Handling & Scoop Technique",
  set_position: "Set Position, Movement & Footwork",
  diving: "Collapse Dive & Low Dive",
  crosses: "Crosses & Covering Space",
  distribution: "Distribution, Rolling & Long Throws",
  passing: "Passing (Inside-Foot, One/Two-Touch)",
  indoor: "Indoor / Home Exercises",
  outdoor: "Outdoor Exercises",
};

export default async function TrainingLibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: videos } = await supabase
    .from("training_videos")
    .select("id, title, description, category, sub_type, storage_path, duration_seconds")
    .eq("published", true)
    .order("category")
    .order("sort_order");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("video_id")
    .eq("user_id", user!.id);
  const favoriteIds = new Set((favorites ?? []).map((f) => f.video_id));

  const byCategory = new Map<string, typeof videos>();
  for (const video of videos ?? []) {
    byCategory.set(video.category, [...(byCategory.get(video.category) ?? []), video]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Training Library</h1>
        <p className="text-ink-muted">Every technical category in one place.</p>
      </div>

      {byCategory.size === 0 && (
        <p className="text-sm text-ink-muted">
          No videos published yet — check back soon, or contact your coach.
        </p>
      )}

      {Array.from(byCategory.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 font-semibold text-ink">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items!.map((video) => (
              <div key={video.id} className="rounded-[0.875rem] bg-paper p-4 shadow-sm">
                <p className="font-medium text-ink">{video.title}</p>
                {video.description && (
                  <p className="mt-1 text-sm text-ink-muted">{video.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs uppercase text-ink-muted">{video.sub_type ?? "—"}</span>
                  <form action={toggleFavoriteAction}>
                    <input type="hidden" name="video_id" value={video.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-gold-dark hover:text-gold-dark"
                    >
                      {favoriteIds.has(video.id) ? "★ Favorited" : "☆ Favorite"}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
