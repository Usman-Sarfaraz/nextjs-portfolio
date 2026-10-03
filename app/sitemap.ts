import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.url ? [{ url: siteConfig.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }] : [];
}
