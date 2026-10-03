import type { Metadata } from "next";
import { profile } from "./profile";

// Set this to the portfolio's public URL when deploying.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteConfig = {
  name: profile.name,
  description: profile.description,
  url: siteUrl,
  ogImage: "/images/usman.webp",
} as const;

export const baseMetadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: profile.name, template: `%s | ${profile.name}` },
  description: profile.description,
  keywords: ["Usman Sarfraz", "Frontend Developer", "Software Engineer", "React", "Next.js", "Vue", "Nuxt", "TypeScript", "Tailwind CSS", "Lahore"],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: profile.name,
    description: profile.description,
    siteName: profile.name,
    ...(siteUrl ? { url: siteUrl, images: [{ url: siteConfig.ogImage, alt: profile.name }] } : {}),
  },
  icons: { icon: "/icon.svg", apple: "/apple-icon.svg" },
  manifest: "/site.webmanifest",
};

export function createMetadata({ title, description, path = "/" }: { title?: string; description?: string; path?: string }): Metadata {
  return {
    ...(title ? { title } : {}),
    description: description ?? profile.description,
    ...(siteUrl ? { alternates: { canonical: path } } : {}),
  };
}
