import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, HelpNote } from "@/components/admin/ui";
import type { SCProgramRow } from "@/lib/content";
import { saveSCProgramAction } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  program: "Core program",
  bundle: "Bundle",
  custom: "Personalized plan",
};

export default async function AdminSCProgramsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("sc_programs").select("*").order("sort_order");
  const programs = (data as SCProgramRow[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Strength & Conditioning Programs"
        description="The KeeperHQ x TAP programs shown on your S&C page."
      />

      <HelpNote>
        As with memberships, the price here is display text only — the amount actually charged
        comes from Stripe. Update both when TAP pricing is finalized.
      </HelpNote>

      <div className="space-y-4">
        {programs.map((program) => (
          <Card key={program.key}>
            <form action={saveSCProgramAction} className="space-y-4">
              <input type="hidden" name="key" value={program.key} />

              <div className="flex items-center justify-between">
                <h2 className="font-bold text-ink">{program.title}</h2>
                <span className="text-xs text-ink-muted">
                  {CATEGORY_LABELS[program.category] ?? program.category}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <input name="title" required defaultValue={program.title} className={inputClass} />
                </Field>
                <Field label="Price" hint="Text only, e.g. $25–$40">
                  <input
                    name="price_display"
                    defaultValue={program.price_display ?? ""}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Focus / description">
                <textarea
                  name="focus"
                  rows={2}
                  defaultValue={program.focus ?? ""}
                  className={inputClass}
                />
              </Field>

              <div className="flex items-center gap-4">
                <SaveButton>Save</SaveButton>
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  <input type="checkbox" name="published" defaultChecked={program.published} />
                  Show on website
                </label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={program.sort_order}
                  className="w-20 rounded-lg border border-line px-2 py-1 text-sm"
                  aria-label="Order"
                />
              </div>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
