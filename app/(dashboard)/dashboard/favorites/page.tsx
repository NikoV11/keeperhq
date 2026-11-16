import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleFavoriteAction } from "../training/actions";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("video_id, training_videos(id, title, description, category)")
    .eq("user_id", user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Favorites</h1>
        <p className="text-ink-muted">Videos you&apos;ve saved for quick access.</p>
      </div>

      {!favorites || favorites.length === 0 ? (
        <p className="text-sm text-ink-muted">
          No favorites yet.{" "}
          <Link href="/dashboard/training" className="text-gold-dark font-medium">
            Browse the Training Library
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => {
            const video = f.training_videos as unknown as { id: string; title: string; description: string | null; category: string };
            if (!video) return null;
            return (
              <div key={video.id} className="rounded-[0.875rem] bg-paper p-4 shadow-sm">
                <p className="font-medium text-ink">{video.title}</p>
                {video.description && (
                  <p className="mt-1 text-sm text-ink-muted">{video.description}</p>
                )}
                <form action={toggleFavoriteAction} className="mt-3">
                  <input type="hidden" name="video_id" value={video.id} />
                  <button type="submit" className="text-xs font-medium text-gold-dark">
                    ★ Remove favorite
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
