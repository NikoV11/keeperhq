import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, DangerButton, HelpNote, EmptyState } from "@/components/admin/ui";
import { FileUploadField } from "@/components/admin/file-upload-field";
import type { Testimonial } from "@/lib/content";
import { saveTestimonialAction, deleteTestimonialAction } from "./actions";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("kind").order("sort_order");
  const all = (data as Testimonial[]) ?? [];
  const videos = all.filter((t) => t.kind === "video");
  const written = all.filter((t) => t.kind === "written");

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Video and written testimonials from goalkeepers and parents."
      />

      <HelpNote>
        Tick <strong>Featured</strong> on your best two or three video testimonials — those are
        the ones shown on the homepage. The rest appear on the Testimonials page.
      </HelpNote>

      <section className="mb-10">
        <h2 className="mb-3 font-semibold text-brand-black">Video testimonials</h2>
        {videos.length === 0 ? (
          <EmptyState>No video testimonials yet.</EmptyState>
        ) : (
          <div className="space-y-4">
            {videos.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}
        <div className="mt-4">
          <AddTestimonialForm kind="video" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-brand-black">Written testimonials</h2>
        {written.length === 0 ? (
          <EmptyState>No written testimonials yet.</EmptyState>
        ) : (
          <div className="space-y-4">
            {written.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        )}
        <div className="mt-4">
          <AddTestimonialForm kind="written" />
        </div>
      </section>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card>
      <form action={saveTestimonialAction} className="space-y-4">
        <input type="hidden" name="id" value={testimonial.id} />
        <input type="hidden" name="kind" value={testimonial.kind} />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Name">
            <input name="name" required defaultValue={testimonial.name} className={inputClass} />
          </Field>
          <Field label="Club / college / level">
            <input name="affiliation" defaultValue={testimonial.affiliation ?? ""} className={inputClass} />
          </Field>
          <Field label="Age (optional)">
            <input name="age" type="number" defaultValue={testimonial.age ?? ""} className={inputClass} />
          </Field>
        </div>

        <Field label="Quote">
          <textarea name="quote" rows={2} defaultValue={testimonial.quote ?? ""} className={inputClass} />
        </Field>

        {testimonial.kind === "video" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField
              name="video_path"
              label="Video file"
              accept="video/*"
              prefix="testimonials"
              currentPath={testimonial.video_path}
            />
            <FileUploadField
              name="thumbnail_path"
              label="Cover image"
              accept="image/*"
              prefix="testimonials"
              currentPath={testimonial.thumbnail_path}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <SaveButton>Save</SaveButton>
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input type="checkbox" name="featured" defaultChecked={testimonial.featured} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input type="checkbox" name="published" defaultChecked={testimonial.published} />
            Show on website
          </label>
          <Field label="">
            <input
              name="sort_order"
              type="number"
              defaultValue={testimonial.sort_order}
              className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
              aria-label="Order"
            />
          </Field>
        </div>
      </form>

      <form action={deleteTestimonialAction} className="mt-3 border-t border-gray-100 pt-3">
        <input type="hidden" name="id" value={testimonial.id} />
        <DangerButton>Delete this testimonial</DangerButton>
      </form>
    </Card>
  );
}

function AddTestimonialForm({ kind }: { kind: "video" | "written" }) {
  return (
    <form action={saveTestimonialAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-gray-300 p-4">
      <input type="hidden" name="kind" value={kind} />
      <div className="min-w-[180px] flex-1">
        <Field label={`Add a ${kind} testimonial`}>
          <input name="name" required placeholder="Goalkeeper or parent name" className={inputClass} />
        </Field>
      </div>
      <div className="min-w-[180px] flex-1">
        <Field label="Club / college / level">
          <input name="affiliation" className={inputClass} />
        </Field>
      </div>
      <SaveButton>Add</SaveButton>
    </form>
  );
}
