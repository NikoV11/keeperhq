"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, Field, inputClass, SaveButton } from "@/components/admin/ui";
import { CATEGORY_OPTIONS, SUB_TYPE_OPTIONS } from "@/lib/training-categories";
import { saveVideoAction } from "./actions";

type ExistingVideo = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  sub_type: string | null;
  storage_path: string;
  thumbnail_path: string | null;
  is_free_trial: boolean;
  sort_order: number;
  published: boolean;
};

export function VideoForm({ video }: { video?: ExistingVideo }) {
  const [videoPath, setVideoPath] = useState(video?.storage_path ?? "");
  const [thumbnailPath, setThumbnailPath] = useState(video?.thumbnail_path ?? "");

  return (
    <form action={saveVideoAction} className="space-y-6">
      {video && <input type="hidden" name="id" value={video.id} />}
      <input type="hidden" name="storage_path" value={videoPath} />
      <input type="hidden" name="thumbnail_path" value={thumbnailPath} />

      <Card className="space-y-4">
        <h2 className="font-semibold text-ink">1. The video file</h2>
        <FileUploader
          label="Video"
          accept="video/*"
          prefix="training"
          currentPath={videoPath}
          onUploaded={setVideoPath}
          hint="MP4 works best. Large files take a few minutes — don't close this page while it uploads."
        />
        <FileUploader
          label="Cover image (optional)"
          accept="image/*"
          prefix="training"
          currentPath={thumbnailPath}
          onUploaded={setThumbnailPath}
          hint="A still image shown before the video plays."
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-ink">2. Details</h2>

        <Field label="Title">
          <input name="title" required defaultValue={video?.title ?? ""} className={inputClass} />
        </Field>

        <Field label="Description" hint="A short explanation of the exercise.">
          <textarea
            name="description"
            rows={3}
            defaultValue={video?.description ?? ""}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select name="category" required defaultValue={video?.category ?? ""} className={inputClass}>
              <option value="">Choose a category...</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Exercise type">
            <select name="sub_type" defaultValue={video?.sub_type ?? ""} className={inputClass}>
              <option value="">Not specified</option>
              {SUB_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Order" hint="Lower numbers appear first within the category.">
          <input
            name="sort_order"
            type="number"
            defaultValue={video?.sort_order ?? 0}
            className={inputClass}
          />
        </Field>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="is_free_trial"
            defaultChecked={video?.is_free_trial ?? false}
            className="mt-1"
          />
          <span>
            <strong>Free sample</strong> — visitors can watch this without paying. Use for up to
            three videos.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={video?.published ?? true}
            className="mt-1"
          />
          <span>
            <strong>Visible on the website</strong> — uncheck to hide it while you work on it.
          </span>
        </label>
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton>{video ? "Save Changes" : "Add Video"}</SaveButton>
        <Link href="/admin/videos" className="text-sm font-medium text-ink-muted hover:text-ink">
          Cancel
        </Link>
        {!videoPath && (
          <p className="text-sm text-amber-700">Upload a video file first.</p>
        )}
      </div>
    </form>
  );
}

function FileUploader({
  label,
  accept,
  prefix,
  currentPath,
  onUploaded,
  hint,
}: {
  label: string;
  accept: string;
  prefix: string;
  currentPath: string;
  onUploaded: (path: string) => void;
  hint?: string;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    currentPath ? "done" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setError(null);

    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${prefix}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);

    if (uploadError) {
      setStatus("error");
      setError(uploadError.message);
      return;
    }

    onUploaded(path);
    setStatus("done");
  }

  return (
    <Field label={label} hint={hint}>
      <input type="file" accept={accept} onChange={handleChange} className="block w-full text-sm" />
      {status === "uploading" && (
        <p className="mt-1 text-sm text-ink-muted">Uploading, please wait...</p>
      )}
      {status === "done" && currentPath && (
        <p className="mt-1 text-sm text-gold-dark">✓ Uploaded: {currentPath.split("/").pop()}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </Field>
  );
}
