import { createClient } from "@/lib/supabase/server";
import { ReviewActions } from "./actions-client";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("processors")
    .select(`
      id, name, slug, description, website_url, kyc_level,
      onboarding_days_min, onboarding_days_max, status, is_verified,
      last_scraped_at, created_at,
      segments ( slug, display_name )
    `)
    .eq("status", "pending_review")
    .order("last_scraped_at", { ascending: false })
    .limit(100);

  const items = (pending || []) as any[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#0D0F1E" }}>Review queue</h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          {items.length} auto-scraped processors awaiting verification.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border" style={{ borderColor: "#E5E7EB" }}>
          <p style={{ color: "#6B7280" }}>Queue is empty. Run <code>uv run python scripts/scrape_processors.py</code> to populate it.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-5 border" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: "#0D0F1E" }}>{p.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: "#F3F4F6", color: "#6B7280" }}>
                      {p.segments?.display_name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(234,179,8,0.10)", color: "#A16207" }}>
                      KYC: {p.kyc_level}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#4B5563" }}>{p.description}</p>
                  <div className="flex gap-3 text-xs" style={{ color: "#9CA3AF" }}>
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                         className="underline hover:text-gray-700">{p.website_url}</a>
                    )}
                    <span>Onboarding: {p.onboarding_days_min ?? "?"}–{p.onboarding_days_max ?? "?"}d</span>
                    <span>Scraped: {p.last_scraped_at ? new Date(p.last_scraped_at).toLocaleDateString() : "—"}</span>
                  </div>
                </div>
                <ReviewActions processorId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
