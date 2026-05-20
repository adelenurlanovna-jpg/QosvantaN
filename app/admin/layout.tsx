import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=admin_required");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!(profile as any)?.is_admin) {
    redirect("/?error=admin_only");
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F6FA" }}>
      <header className="border-b" style={{ background: "#0D0F1E", borderColor: "#1F2238" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="/" className="text-white font-semibold">Qosvanta</a>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: "#C9A84C" }}>Admin</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="/admin/review" className="text-white/80 hover:text-white">Review queue</a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
