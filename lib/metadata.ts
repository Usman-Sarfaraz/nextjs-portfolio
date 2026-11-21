import type { Metadata } from "next";
import { profile } from "./profile";

// Keep canonical and social URLs stable even when deployment configuration is absent.
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://usmansarfraz.dev").origin;

export const siteConfig = {
  name: "Usman Sarfraz",
  title: "Usman Sarfraz | Frontend Developer & UI Engineer",
  description: "Usman Sarfraz, frontend developer and UI engineer in Lahore. Explore React, Next.js, Vue and Nuxt projects built with thoughtful design and precise development.",
  url: siteUrl,
  ogImage: "/images/og-portfolio.png",
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["Usman Sarfraz", "Frontend Developer", "UI Developer", "Software Engineer", "React", "Next.js", "Vue", "Nuxt", "TypeScript", "Lahore"],
  authors: [{ name: profile.name }],
  creator: profile.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteUrl,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, type: "image/png", alt: "Usman Sarfraz, Frontend Developer & UI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, alt: "Usman Sarfraz, Frontend Developer & UI Engineer" }],
  },
  // Next.js also discovers icon.png and apple-icon.png automatically.
  icons: { icon: [{ url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" }], apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }] },
  manifest: "/site.webmanifest",
};

export function createMetadata({ title, description, path = "/" }: { title?: string; description?: string; path?: string }): Metadata {
  const pageDescription = description ?? siteConfig.description;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  return {
    ...(title ? { title } : {}),
    description: pageDescription,
    openGraph: { ...baseMetadata.openGraph, title: pageTitle, description: pageDescription, url: new URL(path, siteUrl).toString() },
    twitter: { ...baseMetadata.twitter, title: pageTitle, description: pageDescription },
    alternates: { canonical: path },
  };
}
