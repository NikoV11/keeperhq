import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";
import { getSCPrograms } from "@/lib/content";

export default async function DashboardSCPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const programs = await getSCPrograms();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, product_key, status, created_at")
    .eq("user_id", user!.id)
    .in("product_type", ["sc_program", "sc_bundle", "sc_custom"])
    .order("created_at", { ascending: false });

  const { data: questionnaire } = await supabase
    .from("sc_questionnaire_responses")
    .select("recommended_program, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Strength &amp; Conditioning</h1>
        <p className="text-ink-muted">KeeperHQ x TAP goalkeeper-specific physical development.</p>
      </div>

      {!questionnaire ? (
        <div className="rounded-xl bg-ink p-6 text-paper">
          <p className="font-semibold">Not sure which program fits you?</p>
          <p className="mt-1 text-sm text-paper/70">
            Take the 2-minute intake questionnaire for a recommendation.
          </p>
          <Link
            href="/strength-conditioning/questionnaire"
            className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 text-sm font-semibold hover:bg-[#ffc23d]"
          >
            Take the Questionnaire
          </Link>
        </div>
      ) : (
        <p className="text-sm text-ink-muted">
          Based on your questionnaire, we recommended:{" "}
          <span className="font-semibold capitalize text-ink">
            {programs.find((p) => p.key === questionnaire.recommended_program)?.title ??
              questionnaire.recommended_program.replace(/_/g, " ")}
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {programs.map((program) => (
          <div key={program.key} className="rounded-[0.875rem] border border-line bg-paper p-5">
            <p className="font-semibold text-ink">{program.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{program.focus}</p>
            <p className="mt-2 text-sm font-medium text-ink">{program.price_display}</p>
            <CheckoutButton
              productType={
                program.category === "bundle"
                  ? "sc_bundle"
                  : program.category === "custom"
                    ? "sc_custom"
                    : "sc_program"
              }
              productKey={program.category === "custom" ? "sc_custom_onetime" : program.key}
              className="mt-3"
            >
              Purchase
            </CheckoutButton>
          </div>
        ))}
      </div>

      <div className="rounded-[0.875rem] border border-line bg-paper p-5">
        <h2 className="mb-3 font-semibold text-ink">Your S&amp;C orders</h2>
        {!orders || orders.length === 0 ? (
          <p className="text-sm text-ink-muted">No purchases yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {orders.map((order) => (
              <li key={order.id} className="flex justify-between text-ink">
                <span className="capitalize">{order.product_key.replace(/_/g, " ")}</span>
                <span className="capitalize">{order.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
