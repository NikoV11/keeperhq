import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, DangerButton, HelpNote, EmptyState } from "@/components/admin/ui";
import { FileUploadField } from "@/components/admin/file-upload-field";
import type { Testimonial, TestimonialCategory } from "@/lib/content";
import { saveTestimonialAction, deleteTestimonialAction } from "./actions";

const GROUPS: { category: TestimonialCategory; label: string; note: string }[] = [
  { category: "goalkeeper", label: "Goalkeepers", note: "These also fill the “Goalkeepers We Have Worked With” section." },
  { category: "coach", label: "Coaches", note: "Coaches and directors who have worked alongside you." },
  { category: "parent", label: "Parents", note: "Parents speaking about their children." },
];

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const all = (data as Testimonial[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description={`${all.length} testimonials from goalkeepers, coaches, and parents.`}
      />

      <HelpNote>
        Tick <strong>Featured</strong> on your best two or three to put them on the homepage.
        Goalkeepers here also appear in the &ldquo;Goalkeepers We Have Worked With&rdquo;
        section &mdash; you only enter each person once.
      </HelpNote>

      {GROUPS.map((group) => {
        const items = all.filter((t) => t.category === group.category);
        return (
          <section key={group.category} className="mb-10">
            <h2 className="font-semibold text-ink">
              {group.label} <span className="text-ink-muted">({items.length})</span>
            </h2>
            <p className="mb-3 text-sm text-ink-muted">{group.note}</p>

            {items.length === 0 ? (
              <EmptyState>None yet.</EmptyState>
            ) : (
              <div className="space-y-4">
                {items.map((t) => (
                  <TestimonialEditor key={t.id} testimonial={t} />
                ))}
              </div>
            )}

            <AddForm category={group.category} label={group.label} />
          </section>
        );
      })}
    </div>
  );
}

function TestimonialEditor({ testimonial: t }: { testimonial: Testimonial }) {
  return (
    <Card>
      <form action={saveTestimonialAction} className="space-y-4">
        <input type="hidden" name="id" value={t.id} />

        <div className="flex items-center justify-between gap-4">
          <h3 className="font-bold text-ink">{t.name}</h3>
          {!t.quote && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Quote missing
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name">
            <input name="name" required defaultValue={t.name} className={inputClass} />
          </Field>
          <Field label="Group">
            <select name="category" defaultValue={t.category} className={inputClass}>
              <option value="goalkeeper">Goalkeeper</option>
              <option value="coach">Coach</option>
              <option value="parent">Parent</option>
            </select>
          </Field>
          <Field label="Type">
            <select name="kind" defaultValue={t.kind} className={inputClass}>
              <option value="written">Written</option>
              <option value="video">Video</option>
            </select>
          </Field>
        </div>

        <Field
          label="Background & career"
          hint="One point per line. The first line shows under their name; the rest appear under “Background & career”."
        >
          <textarea
            name="profile"
            rows={Math.max(3, t.profile.length)}
            defaultValue={t.profile.join("\n")}
            className={inputClass}
          />
        </Field>

        <Field label="Testimonial" hint="Leave a blank line between paragraphs.">
          <textarea name="quote" rows={6} defaultValue={t.quote ?? ""} className={inputClass} />
        </Field>

        <details>
          <summary className="cursor-pointer text-sm font-medium text-gold-dark">
            Original language version {t.quote_original ? "(set)" : "(optional)"}
          </summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_160px]">
            <Field label="Original text">
              <textarea
                name="quote_original"
                rows={4}
                defaultValue={t.quote_original ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Language">
              <input
                name="quote_original_language"
                defaultValue={t.quote_original_language ?? ""}
                placeholder="German"
                className={inputClass}
              />
            </Field>
          </div>
        </details>

        <div className="grid gap-4 sm:grid-cols-2">
          <FileUploadField
            name="photo_path"
            label="Photo"
            accept="image/*"
            prefix="testimonials"
            currentPath={t.photo_path}
            hint="A square photo looks best."
          />
          {t.kind === "video" && (
            <FileUploadField
              name="video_path"
              label="Video file"
              accept="video/*"
              prefix="testimonials"
              currentPath={t.video_path}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <SaveButton>Save</SaveButton>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" name="featured" defaultChecked={t.featured} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" name="published" defaultChecked={t.published} />
            Show on website
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            Order
            <input
              name="sort_order"
              type="number"
              defaultValue={t.sort_order}
              className="w-20 rounded-lg border border-line px-2 py-1 text-sm"
            />
          </label>
        </div>
      </form>

      <form action={deleteTestimonialAction} className="mt-3 border-t border-line/60 pt-3">
        <input type="hidden" name="id" value={t.id} />
        <DangerButton>Delete {t.name}</DangerButton>
      </form>
    </Card>
  );
}

function AddForm({ category, label }: { category: TestimonialCategory; label: string }) {
  return (
    <form
      action={saveTestimonialAction}
      className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-line p-4"
    >
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="kind" value="written" />
      <div className="min-w-[180px] flex-1">
        <Field label={`Add to ${label}`}>
          <input name="name" required placeholder="Name" className={inputClass} />
        </Field>
      </div>
      <div className="min-w-[180px] flex-1">
        <Field label="Club / role / level">
          <input name="profile" placeholder="Shows under their name" className={inputClass} />
        </Field>
      </div>
      <SaveButton>Add</SaveButton>
    </form>
  );
}
