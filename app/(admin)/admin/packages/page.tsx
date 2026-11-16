import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, HelpNote } from "@/components/admin/ui";
import type { MembershipPackage } from "@/lib/content";
import { savePackageAction } from "./actions";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("membership_packages").select("*").order("sort_order");
  const packages = (data as MembershipPackage[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Membership Prices"
        description="The Bronze, Silver, and Gold cards shown on your homepage and Packages page."
      />

      <HelpNote>
        <strong>Important:</strong> changing the price here only changes the text visitors see.
        To change what members are actually charged, you must also update the price in your
        Stripe dashboard. Keep the two matching.
      </HelpNote>

      <div className="space-y-6">
        {packages.map((pkg) => (
          <Card key={pkg.key}>
            <form action={savePackageAction} className="space-y-4">
              <input type="hidden" name="key" value={pkg.key} />
              <h2 className="text-lg font-bold text-ink">{pkg.name}</h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Display name">
                  <input name="name" required defaultValue={pkg.name} className={inputClass} />
                </Field>
                <Field label="Price" hint="Text only, e.g. $39.99">
                  <input
                    name="price_display"
                    required
                    defaultValue={pkg.price_display}
                    className={inputClass}
                  />
                </Field>
                <Field label="Price suffix">
                  <input name="price_note" defaultValue={pkg.price_note} className={inputClass} />
                </Field>
              </div>

              <Field label="Evaluation summary">
                <input
                  name="evaluation_note"
                  defaultValue={pkg.evaluation_note ?? ""}
                  className={inputClass}
                />
              </Field>

              <Field label="Features" hint="One feature per line.">
                <textarea
                  name="features"
                  rows={5}
                  defaultValue={pkg.features.join("\n")}
                  className={inputClass}
                />
              </Field>

              <div className="flex items-center gap-4">
                <SaveButton>Save {pkg.name}</SaveButton>
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  <input type="checkbox" name="featured" defaultChecked={pkg.featured} />
                  Highlight as &ldquo;Most Popular&rdquo;
                </label>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
