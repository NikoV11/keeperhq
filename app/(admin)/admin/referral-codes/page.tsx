import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, Field, inputClass, SaveButton, DangerButton, HelpNote, EmptyState } from "@/components/admin/ui";
import { saveReferralCodeAction, deleteReferralCodeAction } from "./actions";

type ReferralCode = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  active: boolean;
  applies_to: string[];
  expires_at: string | null;
};

export default async function AdminReferralCodesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("referral_codes").select("*").order("code");
  const codes = (data as ReferralCode[]) ?? [];

  return (
    <div>
      <PageHeader
        title="Discount Codes"
        description="Codes customers can enter at checkout for a discount."
      />

      <HelpNote>
        <strong>Important:</strong> a code also has to exist in Stripe to actually reduce the
        price. In Stripe, go to <em>Product catalogue → Coupons</em>, create a promotion code
        with the exact same code text, then add it here.
      </HelpNote>

      {codes.length === 0 ? (
        <EmptyState>No discount codes yet.</EmptyState>
      ) : (
        <div className="space-y-4">
          {codes.map((code) => (
            <Card key={code.code}>
              <form action={saveReferralCodeAction} className="space-y-4">
                <input type="hidden" name="code" value={code.code} />
                <h2 className="font-mono font-bold text-ink">{code.code}</h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Discount type">
                    <select
                      name="discount_type"
                      defaultValue={code.discount_type}
                      className={inputClass}
                    >
                      <option value="percent">Percentage off</option>
                      <option value="fixed">Fixed amount off</option>
                    </select>
                  </Field>
                  <Field label="Amount" hint="20 = 20% or $20 depending on type.">
                    <input
                      name="discount_value"
                      type="number"
                      step="0.01"
                      defaultValue={code.discount_value}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Expires" hint="Leave empty for no expiry.">
                    <input
                      name="expires_at"
                      type="date"
                      defaultValue={code.expires_at ? code.expires_at.slice(0, 10) : ""}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-4">
                  <SaveButton>Save</SaveButton>
                  <label className="flex items-center gap-2 text-sm text-ink-muted">
                    <input type="checkbox" name="active" defaultChecked={code.active} />
                    Active
                  </label>
                </div>
              </form>

              <form action={deleteReferralCodeAction} className="mt-3 border-t border-line/60 pt-3">
                <input type="hidden" name="code" value={code.code} />
                <DangerButton>Delete</DangerButton>
              </form>
            </Card>
          ))}
        </div>
      )}

      <form
        action={saveReferralCodeAction}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-line p-4"
      >
        <div className="min-w-[160px]">
          <Field label="New code">
            <input name="code" required placeholder="KEEPERHQ20" className={inputClass} />
          </Field>
        </div>
        <div className="min-w-[140px]">
          <Field label="Type">
            <select name="discount_type" className={inputClass}>
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
          </Field>
        </div>
        <div className="min-w-[100px]">
          <Field label="Amount">
            <input name="discount_value" type="number" step="0.01" required className={inputClass} />
          </Field>
        </div>
        <SaveButton>Add Code</SaveButton>
      </form>
    </div>
  );
}
