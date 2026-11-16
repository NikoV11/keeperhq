import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState, HelpNote, DangerButton } from "@/components/admin/ui";
import { CATEGORY_LABELS } from "@/lib/training-categories";
import { deleteVideoAction, togglePublishedAction } from "./actions";

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("training_videos")
    .select("id, title, category, sub_type, is_free_trial, published, sort_order")
    .order("category")
    .order("sort_order");

  const grouped = new Map<string, NonNullable<typeof videos>>();
  for (const video of videos ?? []) {
    grouped.set(video.category, [...(grouped.get(video.category) ?? []), video]);
  }

  return (
    <div>
      <PageHeader
        title="Training Videos"
        description="Your training library. Members see these once they have a membership."
        action={
          <Link
            href="/admin/videos/new"
            className="shrink-0 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ffc23d]"
          >
            + Upload Video
          </Link>
        }
      />

      <HelpNote>
        Mark up to three videos as a <strong>Free sample</strong> &mdash; those are the ones
        visitors can watch before they pay, shown on your homepage.
      </HelpNote>

      {!videos || videos.length === 0 ? (
        <EmptyState>
          You haven&apos;t uploaded any training videos yet.{" "}
          <Link href="/admin/videos/new" className="font-semibold text-gold-dark">
            Upload your first one
          </Link>
          .
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([category, items]) => (
            <Card key={category}>
              <h2 className="mb-3 font-semibold text-ink">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <ul className="divide-y divide-gray-100">
                {items.map((video) => (
                  <li key={video.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{video.title}</p>
                      <p className="text-xs text-ink-muted">
                        {video.sub_type ?? "—"}
                        {video.is_free_trial && (
                          <span className="ml-2 rounded bg-gold/10 px-1.5 py-0.5 font-semibold text-gold-dark">
                            Free sample
                          </span>
                        )}
                        {!video.published && (
                          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-ink-muted">
                            Hidden
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/admin/videos/${video.id}`}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-gold"
                      >
                        Edit
                      </Link>
                      <form action={togglePublishedAction}>
                        <input type="hidden" name="id" value={video.id} />
                        <input type="hidden" name="published" value={String(!video.published)} />
                        <button
                          type="submit"
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-gold"
                        >
                          {video.published ? "Hide" : "Show"}
                        </button>
                      </form>
                      <form action={deleteVideoAction}>
                        <input type="hidden" name="id" value={video.id} />
                        <DangerButton>Delete</DangerButton>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
