import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-url";
import { ARTICLES } from "./articles";

export const metadata: Metadata = {
  title: "Blog — Payment Industry Guides, Comparisons & Deep Dives",
  description:
    "In-depth guides on payment processing, high-risk acquiring, crypto gateways, iGaming compliance and emerging-market rails. Written for merchants choosing their payment stack.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Qosvanta Blog",
    description: "Payment industry guides and comparisons for merchants.",
    url: `${SITE_URL}/blog`,
    blogPost: ARTICLES.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      datePublished: a.publishedAt,
      url: `${SITE_URL}/blog/${a.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />

      <Header />

      <section style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="badge badge-blue mb-6" style={{ display: "inline-flex" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3B82F6" }} />
            Payment industry insights
          </div>
          <h1
            className="text-[2rem] sm:text-4xl lg:text-[3rem] font-bold leading-[1.05] mb-4 max-w-3xl"
            style={{ color: "#0F172A", letterSpacing: "-0.025em" }}
          >
            Payment infrastructure, decoded.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "#334155" }}>
            Deep-dive guides and comparisons for merchants choosing their payment stack — high-risk acquiring, crypto gateways, iGaming compliance, emerging-market rails and more.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group p-7 rounded-2xl transition-all hover:border-slate-300 hover:shadow-lg"
                style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(59,130,246,0.10)", color: "#3B82F6" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-3 leading-snug tracking-tight"
                  style={{ color: "#0F172A", letterSpacing: "-0.015em" }}
                >
                  {a.title}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#475569" }}>
                  {a.description}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: "#94A3B8" }}>
                  <time dateTime={a.publishedAt}>
                    {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </time>
                  <span>·</span>
                  <span>{a.readMinutes} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
