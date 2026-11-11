import { createClient } from "@/lib/supabase/server";
import { CheckoutButton } from "@/components/checkout-button";

export default async function GameAnalysisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, amount_cents, created_at")
    .eq("user_id", user!.id)
    .eq("product_type", "game_analysis")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Game Video Analysis</h1>
        <p className="text-brand-gray">
          A full breakdown of your game: positioning, decision-making, crosses, distribution,
          and key match situations — reviewed 1-on-1 with a coach on Zoom.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-lg font-bold text-brand-black">$39.99 — One-Time Purchase</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-brand-gray">
          <li>Purchase the analysis</li>
          <li>Schedule the Zoom session</li>
          <li>Upload the complete game or provide a full-game link</li>
          <li>Submit footage at least 7 days before the scheduled Zoom</li>
          <li>Your coach reviews and prepares the analysis</li>
          <li>Meet 1-on-1 on Zoom to discuss the game</li>
        </ol>
        <CheckoutButton productType="game_analysis" productKey="game_analysis" className="mt-4">
          Purchase Game Analysis
        </CheckoutButton>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-brand-black mb-3">Order history</h2>
        {!orders || orders.length === 0 ? (
          <p className="text-sm text-brand-gray">No orders yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {orders.map((order) => (
              <li key={order.id} className="flex justify-between text-brand-black">
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{order.status}</span>
                <span>${(order.amount_cents / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
