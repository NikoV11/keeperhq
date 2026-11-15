import { getIntroVideoPath } from "@/lib/content";
import { publicMediaUrl } from "@/lib/media";

export async function IntroVideo() {
  const path = await getIntroVideoPath();
  const src = publicMediaUrl(path);

  if (!src) {
    return (
      <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-brand-gray-light">
        <div className="flex h-full items-center justify-center text-sm text-brand-gray">
          Introduction video coming soon.
        </div>
      </div>
    );
  }

  return (
    <video
      controls
      preload="metadata"
      className="aspect-video w-full max-w-4xl rounded-2xl bg-black"
    >
      <source src={src} />
      Your browser doesn&apos;t support embedded video.
    </video>
  );
}
