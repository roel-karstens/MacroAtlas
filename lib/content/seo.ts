import type { Metadata } from "next";

export const siteUrl = "https://macroatlas.vercel.app";

/** Descriptions and social cards. Indexing stays off until the owner says otherwise. */
export function pageMetadata(input: { title?: string; description: string; path: string }): Metadata {
  const title = input.title ? `${input.title} · Macro Atlas` : "Macro Atlas";
  return {
    ...(input.title ? { title: input.title } : {}),
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title,
      description: input.description,
      url: input.path,
      siteName: "Macro Atlas",
      locale: "en_US",
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}
