import { createClient } from "@/lib/supabase/server";

export async function ClipPlayer({ storagePath }: { storagePath: string }) {
  const supabase = await createClient();
  const { data } = await supabase.storage.from("media").createSignedUrl(storagePath, 3600);

  if (!data?.signedUrl) {
    return (
      <p className="mt-3 text-sm text-ink-muted">
        Couldn&apos;t load this clip. It may still be uploading.
      </p>
    );
  }

  return (
    <video controls preload="metadata" className="mt-3 w-full max-w-2xl rounded-lg bg-black">
      <source src={data.signedUrl} />
      Your browser doesn&apos;t support embedded video.
    </video>
  );
}
