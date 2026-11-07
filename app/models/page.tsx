import Link from "next/link";
import { Container, PageIntro } from "@/components/editorial";
import { models } from "@/lib/content/models";
import { pageMetadata } from "@/lib/content/seo";

export const metadata = pageMetadata({
  title: "Tools",
  description: "Two browser calculators: oil operating profit and bond yield sensitivity. Nothing is stored unless you choose Remember. Not a forecast.",
  path: "/models",
});

export default function ModelsPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Tools"
        title="Two calculators. No forecasts."
        deck="Both run in the browser. A comparison is stored on this device only if you ask for that. Nothing in this edition writes a scenario to a server. The formulas do not read a Brent or euro-area yield series."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {models.map((model) => (
          <article key={model.id} className="border border-[#e4e6ea] p-6">
            <h2 className="font-display text-5xl leading-none font-semibold">
              <Link href={model.href} className="underline-offset-4 hover:underline">
                {model.title}
              </Link>
            </h2>
            <p className="mt-4 text-sm leading-relaxed">{model.summary}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#3f4651]">{model.formula}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#3f4651]">{model.persistence}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
