import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, DangerButton, HelpNote, EmptyState } from "@/components/admin/ui";
import { FileUploadField } from "@/components/admin/file-upload-field";
import type { GoalkeeperCard } from "@/lib/content";
import { saveGoalkeeperAction, deleteGoalkeeperAction } from "./actions";

export default async function AdminGoalkeepersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("goalkeepers").select("*").order("sort_order");
  const goalkeepers = (data as GoalkeeperCard[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Goalkeepers We Have Worked With"
        description="Cards showing your coaching track record."
      />

      <HelpNote>
        Only add a goalkeeper&apos;s photo, name, and quote if you have their permission (and a
        parent&apos;s permission if they&apos;re under 18).
      </HelpNote>

      {goalkeepers.length === 0 ? (
        <EmptyState>No goalkeepers added yet.</EmptyState>
      ) : (
        <div className="space-y-4">
          {goalkeepers.map((gk) => (
            <Card key={gk.id}>
              <form action={saveGoalkeeperAction} className="space-y-4">
                <input type="hidden" name="id" value={gk.id} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input name="name" required defaultValue={gk.name} className={inputClass} />
                  </Field>
                  <Field label="Club / college">
                    <input name="affiliation" defaultValue={gk.affiliation ?? ""} className={inputClass} />
                  </Field>
                  <Field label="Playing level">
                    <input name="level" defaultValue={gk.level ?? ""} className={inputClass} />
                  </Field>
                  <Field label="Coach who worked with them">
                    <input name="coach" defaultValue={gk.coach ?? ""} className={inputClass} />
                  </Field>
                </div>

                <Field label="Short quote (optional)">
                  <textarea name="quote" rows={2} defaultValue={gk.quote ?? ""} className={inputClass} />
                </Field>

                <FileUploadField
                  name="photo_path"
                  label="Photo"
                  accept="image/*"
                  prefix="photos"
                  currentPath={gk.photo_path}
                />

                <div className="flex flex-wrap items-center gap-4">
                  <SaveButton>Save</SaveButton>
                  <label className="flex items-center gap-2 text-sm text-brand-gray">
                    <input type="checkbox" name="published" defaultChecked={gk.published} />
                    Show on website
                  </label>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={gk.sort_order}
                    className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    aria-label="Order"
                  />
                </div>
              </form>

              <form action={deleteGoalkeeperAction} className="mt-3 border-t border-gray-100 pt-3">
                <input type="hidden" name="id" value={gk.id} />
                <DangerButton>Delete</DangerButton>
              </form>
            </Card>
          ))}
        </div>
      )}

      <form
        action={saveGoalkeeperAction}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-gray-300 p-4"
      >
        <div className="min-w-[180px] flex-1">
          <Field label="Add a goalkeeper">
            <input name="name" required placeholder="Goalkeeper name" className={inputClass} />
          </Field>
        </div>
        <div className="min-w-[180px] flex-1">
          <Field label="Club / college">
            <input name="affiliation" className={inputClass} />
          </Field>
        </div>
        <SaveButton>Add</SaveButton>
      </form>
    </div>
  );
}
