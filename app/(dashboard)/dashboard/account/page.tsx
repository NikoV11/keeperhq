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
        <h1 className="text-2xl font-bold text-brand-black">My Account</h1>
        <p className="text-brand-gray">Your profile and membership details.</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-brand-gray">Current plan</p>
            <p className="text-lg font-bold capitalize text-brand-black">{plan === "none" ? "No active plan" : plan}</p>
          </div>
          {profile?.stripe_customer_id && <BillingPortalButton />}
        </div>
      </div>

      <form action={updateProfileAction} className="rounded-xl bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Full name</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Email</label>
          <input
            value={profile?.email ?? ""}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-brand-gray"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Country</label>
          <input
            name="country"
            defaultValue={profile?.country ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
          />
        </div>
        <button type="submit" className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-dark">
          Save Changes
        </button>
      </form>
    </div>
  );
}
