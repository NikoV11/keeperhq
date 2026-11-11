"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function UploadForm({ disabled, userId }: { disabled: boolean; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");
    setError(null);

    const supabase = createClient();
    const path = `clips/${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
    if (uploadError) {
      setStatus("error");
      setError(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from("uploaded_clips").insert({
      user_id: userId,
      storage_path: path,
      original_filename: file.name,
      file_size_bytes: file.size,
      notes: notes || null,
    });

    if (insertError) {
      setStatus("error");
      setError(insertError.message);
      return;
    }

    setStatus("idle");
    setFile(null);
    setNotes("");
    formRef.current?.reset();
    router.refresh();
  }

  if (disabled) {
    return (
      <div className="rounded-xl bg-brand-gray-light p-5 text-sm text-brand-gray">
        You&apos;ve reached the 3-clip limit for this evaluation cycle. Your coach will review
        these clips and open up the next cycle once your evaluation is complete.
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl bg-white p-5 shadow-sm space-y-3">
      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">Video file</label>
        <input
          type="file"
          accept="video/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">Notes for your coach (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "uploading" || !file}
        className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
      >
        {status === "uploading" ? "Uploading..." : "Upload Clip"}
      </button>
    </form>
  );
}
