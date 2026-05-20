import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";
import { ARTICLES } from "./blog/articles";

const COUNTRY_SLUGS = [
  "united-states", "united-kingdom", "germany", "france", "spain", "italy", "netherlands",
  "ireland", "switzerland", "malta", "cyprus", "poland", "ukraine", "turkey", "uae",
  "brazil", "mexico", "kazakhstan", "india", "indonesia", "philippines", "malaysia",
  "thailand", "japan", "singapore", "hong-kong", "taiwan", "canada", "australia",
  "nigeria", "kenya", "south-africa", "curacao",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/partners`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/solutions/high-risk-payment-providers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/solutions/crypto-payment-gateways`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/solutions/business-payment-providers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/solutions/alternative-payment-methods`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const { data: processors } = await supabase
    .from("processors")
    .select("slug, last_verified_at, updated_at")
    .eq("status", "active");

  const processorUrls: MetadataRoute.Sitemap = (processors ?? []).map((p: any) => ({
    url: `${SITE_URL}/processors/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : p.last_verified_at ? new Date(p.last_verified_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const { data: segments } = await supabase.from("segments").select("slug");
  const segmentUrls: MetadataRoute.Sitemap = (segments ?? []).map((s: any) => ({
    url: `${SITE_URL}/search?segment=${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const countryUrls: MetadataRoute.Sitemap = COUNTRY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/payment-providers/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.updatedAt ?? a.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [...staticUrls, ...blogUrls, ...countryUrls, ...processorUrls, ...segmentUrls];
}
