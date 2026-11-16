import { createClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscriptions";
import { updateProfileAction } from "./actions";
import { BillingPortalButton } from "./billing-portal-button";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, dob, country, stripe_customer_id")
    .eq("id", user!.id)
    .single();
  const plan = await getUserPlan(user!.id);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Account</h1>
        <p className="text-ink-muted">Your profile and membership details.</p>
      </div>

      <div className="rounded-[0.875rem] border border-line bg-paper p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-ink-muted">Current plan</p>
            <p className="text-lg font-bold capitalize text-ink">{plan === "none" ? "No active plan" : plan}</p>
          </div>
          {profile?.stripe_customer_id && <BillingPortalButton />}
        </div>
      </div>

      <form action={updateProfileAction} className="rounded-[0.875rem] border border-line bg-paper p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Full name</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email</label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full rounded-lg border border-line bg-gray-50 px-3 py-2 text-sm text-ink-muted"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Country</label>
          <input
            name="country"
            defaultValue={profile?.country ?? ""}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink hover:bg-[#ffc23d]">
          Save Changes
        </button>
      </form>
    </div>
  );
}
