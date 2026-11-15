"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/admin/ui";
import { PUBLIC_BUCKET } from "@/lib/media";

/**
 * Uploads straight to Supabase Storage from the browser and keeps the resulting
 * path in a hidden input, so the surrounding plain <form> submits it like any
 * other field. Accepts an already-stored path (or a /images/... placeholder).
 */
export function FileUploadField({
  name,
  label,
  accept,
  prefix,
  currentPath,
  hint,
}: {
  name: string;
  label: string;
  accept: string;
  prefix: string;
  currentPath?: string | null;
  hint?: string;
}) {
  const [path, setPath] = useState(currentPath ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const uploadPath = `${prefix}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(PUBLIC_BUCKET)
      .upload(uploadPath, file);

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    setPath(uploadPath);
  }

  return (
    <Field label={label} hint={hint}>
      <input type="hidden" name={name} value={path} />
      <input type="file" accept={accept} onChange={handleChange} className="block w-full text-sm" />
      {uploading && <p className="mt-1 text-sm text-brand-gray">Uploading...</p>}
      {!uploading && path && (
        <p className="mt-1 truncate text-sm text-brand-green">✓ {path.split("/").pop()}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </Field>
  );
}
