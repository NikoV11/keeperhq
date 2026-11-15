import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { VideoForm } from "../video-form";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video } = await supabase
    .from("training_videos")
    .select("id, title, description, category, sub_type, storage_path, thumbnail_path, is_free_trial, sort_order, published")
    .eq("id", id)
    .maybeSingle();

  if (!video) notFound();

  return (
    <div>
      <PageHeader title="Edit Training Video" description={video.title} />
      <VideoForm video={video} />
    </div>
  );
}
