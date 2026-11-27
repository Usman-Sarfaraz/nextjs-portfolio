import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: new URL("/playground", siteConfig.url).toString(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
