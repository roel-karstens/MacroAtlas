import { articles } from "@/lib/content/articles";
import { images } from "@/lib/content/images";
import { models } from "@/lib/content/models";
import { sources } from "@/lib/content/sources";
import { topics } from "@/lib/content/topics";

export const site = {
  name: "Macro Atlas",
  locale: "en" as const,
  availableLocales: ["en"] as const,
  edition: "November 2026",
  description:
    "A guide to the physical economy: where oil, wheat and computing come from, how those prices reach a bill, and calculators you can check. Dated snapshots, not investment advice.",
};

export const primaryNav = [
  { href: "/topics", label: "Questions" },
  { href: "/atlas", label: "Atlas" },
  { href: "/models", label: "Tools" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
] as const;

export const footerNav = [
  { href: "/methodology", label: "Methodology" },
  { href: "/sources", label: "Sources" },
  { href: "/image-credits", label: "Image credits" },
  { href: "/privacy", label: "Privacy" },
  { href: "/about", label: "About" },
  { href: "/newsletter", label: "Newsletter" },
] as const;

export function allInternalHrefs() {
  const hrefs = new Set<string>([...primaryNav.map((item) => item.href), ...footerNav.map((item) => item.href)]);
  for (const topic of topics) {
    hrefs.add(`/topics/${topic.id}`);
    for (const section of topic.sections) {
      section.links?.forEach((link) => hrefs.add(link.href.split("#")[0] || link.href));
    }
  }
  for (const article of articles) {
    hrefs.add(`/topics/${article.topicId}/${article.slug}`);
    for (const section of article.sections) {
      section.links?.forEach((link) => hrefs.add(link.href.split("#")[0] || "/"));
    }
  }
  for (const model of models) hrefs.add(model.href);
  for (const image of images) hrefs.add(image.src);
  for (const source of sources) {
    if (source.url.startsWith("/")) hrefs.add(source.url);
  }
  return [...hrefs];
}

export const pageFiles = [
  "app/page.tsx",
  "app/atlas/page.tsx",
  "app/topics/page.tsx",
  "app/topics/[topic]/page.tsx",
  "app/topics/[topic]/[article]/page.tsx",
  "app/models/page.tsx",
  "app/models/oil-exposure/page.tsx",
  "app/models/bond-sensitivity/page.tsx",
  "app/methodology/page.tsx",
  "app/sources/page.tsx",
  "app/about/page.tsx",
  "app/image-credits/page.tsx",
  "app/privacy/page.tsx",
  "app/newsletter/page.tsx",
];
