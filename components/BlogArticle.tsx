import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt?: string;
  readMinutes: number;
  tags: string[];
};

export default function BlogArticle({
  meta,
  children,
  related,
}: {
  meta: ArticleMeta;
  children: React.ReactNode;
  related?: { label: string; href: string }[];
}) {
  const date = new Date(meta.publishedAt);
  const dateLabel = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <article className="flex-1">
        <header className="border-b" style={{ borderColor: "rgba(15,23,42,0.06)", background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
          <div className="max-w-[800px] mx-auto px-6 lg:px-8 pt-12 pb-10">
            <nav className="text-xs mb-6" style={{ color: "#64748B" }}>
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-slate-900">Blog</Link>
              <span className="mx-2">/</span>
              <span style={{ color: "#0F172A" }}>{meta.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {meta.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(59,130,246,0.10)", color: "#3B82F6" }}
                >
                  {t}
                </span>
              ))}
            </div>

            <h1
              className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] mb-4"
              style={{ color: "#0F172A", letterSpacing: "-0.025em" }}
            >
              {meta.title}
            </h1>

            <p className="text-lg leading-relaxed mb-6" style={{ color: "#475569" }}>
              {meta.description}
            </p>

            <div className="flex items-center gap-4 text-sm" style={{ color: "#64748B" }}>
              <span>By Qosvanta Editorial</span>
              <span>·</span>
              <time dateTime={meta.publishedAt}>{dateLabel}</time>
              <span>·</span>
              <span>{meta.readMinutes} min read</span>
            </div>
          </div>
        </header>

        <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-12 prose-article">
          {children}
        </div>

        <section className="border-t py-12" style={{ background: "#F8FAFC", borderColor: "rgba(15,23,42,0.06)" }}>
          <div className="max-w-[800px] mx-auto px-6 lg:px-8">
            <div
              className="rounded-2xl p-8 sm:p-10"
              style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)" }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Find the right payment provider in minutes
              </h2>
              <p className="text-base mb-6" style={{ color: "#CBD5E1" }}>
                Browse our curated directory of 200+ payment providers — filter by country, segment, method and fees. Or let Damir, our AI consultant, recommend a shortlist for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
                >
                  Browse providers →
                </Link>
                <Link
                  href="/#get-matched"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold transition-all"
                  style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  Get matched
                </Link>
              </div>
            </div>

            {related && related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold mb-4 tracking-tight" style={{ color: "#0F172A" }}>
                  Related reading
                </h2>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="text-sm font-medium hover:underline" style={{ color: "#3B82F6" }}>
                        {r.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
