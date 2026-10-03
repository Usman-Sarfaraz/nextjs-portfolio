import type { Metadata } from "next";
import { profile } from "./profile";

// Set this to the portfolio's public URL when deploying.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: "Usman Sarfraz",
  title: "Usman Sarfraz | Frontend Developer & UI Engineer",
  description: "Usman Sarfraz is a frontend developer with 3+ years of experience crafting intuitive interfaces and fast web applications with React, Next.js, Vue, and Nuxt.",
  url: siteUrl,
  ogImage: "/images/og-portfolio.png",
} as const;

export const baseMetadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: siteConfig.title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["Usman Sarfraz", "Frontend Developer", "UI Developer", "Software Engineer", "React", "Next.js", "Vue", "Nuxt", "TypeScript", "Lahore"],
  authors: [{ name: profile.name }],
  creator: profile.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    ...(siteUrl ? { url: siteUrl, images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Usman Sarfraz — Frontend Developer & UI Engineer" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    ...(siteUrl ? { images: [siteConfig.ogImage] } : {}),
  },
  // Next.js also discovers icon.png and apple-icon.png automatically.
  icons: { icon: [{ url: "/favicon.ico", sizes: "32x32" }], apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }] },
  manifest: "/site.webmanifest",
};

export function createMetadata({ title, description, path = "/" }: { title?: string; description?: string; path?: string }): Metadata {
  const pageDescription = description ?? siteConfig.description;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  return {
    ...(title ? { title } : {}),
    description: pageDescription,
    openGraph: { ...baseMetadata.openGraph, title: pageTitle, description: pageDescription, ...(siteUrl ? { url: new URL(path, siteUrl).toString() } : {}) },
    twitter: { ...baseMetadata.twitter, title: pageTitle, description: pageDescription },
    ...(siteUrl ? { alternates: { canonical: path } } : {}),
  };
}
