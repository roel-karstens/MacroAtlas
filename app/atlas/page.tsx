import type { Metadata } from "next";
import { AtlasMap } from "@/components/atlas-map";
import { Container, PageIntro } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Atlas",
  description: "A schematic map of selected Persian Gulf oil places, using the same records as the essays and the oil model.",
};

export default function AtlasPage() {
  return (
    <Container className="py-12">
      <PageIntro
        kicker="Atlas · Persian Gulf"
        title="The same places as the research."
        deck="Terminals, pipeline endpoints, and the Hormuz passage. Pan, zoom, filter, and select. Capacities and flows are not stated, because this edition does not have a sourced figure it is willing to print."
      />
      <div className="mt-10">
        <AtlasMap />
      </div>
    </Container>
  );
}
