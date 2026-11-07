"use client";

import { useState } from "react";
import Link from "next/link";
import { chainDependencies, chainStages, type ChainStage } from "@/lib/content/chain";

const position: Record<string, { x: number; y: number }> = {
  "materials-power": { x: 16, y: 18 },
  networks: { x: 700, y: 18 },
  fabs: { x: 16, y: 168 },
  wafers: { x: 210, y: 168 },
  servers: { x: 404, y: 168 },
  operations: { x: 598, y: 168 },
  use: { x: 792, y: 168 },
};

function center(id: string) {
  const box = position[id];
  return { x: box.x + 86, y: box.y + 32 };
}

export function ChainMap() {
  const [selectedId, setSelectedId] = useState("operations");
  const selected = chainStages.find((stage) => stage.id === selectedId) ?? chainStages[0];

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.7fr)]">
      <div className="min-w-0">
        <p className="mb-3 text-sm text-[#3f4651]">
          Schematic chain, not a geographic map. Solid marks are the stage order. Dashed marks are dependencies. Nothing on this drawing is a measured flow.
        </p>
        <div className="min-w-0 overflow-x-auto border border-[#e4e6ea] bg-white">
          <div className="relative aspect-[980/280] min-w-[720px]">
            <svg viewBox="0 0 980 280" className="pointer-events-none absolute inset-0 h-full w-full" role="img" aria-label="Schematic of the physical digital chain. Select a stage for the description.">
              {chainDependencies.map((edge) => {
                const a = center(edge.from);
                const b = center(edge.to);
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="#0072B2"
                    strokeWidth="1.5"
                    strokeDasharray="6 5"
                  />
                );
              })}
              {["fabs", "wafers", "servers", "operations"].map((id, index, row) => {
                if (index === row.length - 1) return null;
                const a = center(id);
                const b = center(row[index + 1]);
                return <line key={id} x1={a.x + 70} y1={a.y} x2={b.x - 70} y2={b.y} stroke="#141414" strokeWidth="1.25" />;
              })}
              <line x1={center("operations").x + 70} y1={center("operations").y} x2={center("use").x - 70} y2={center("use").y} stroke="#141414" strokeWidth="1.25" />
            </svg>
            {chainStages.map((stage) => {
              const box = position[stage.id];
              const active = stage.id === selectedId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(stage.id)}
                  className={`absolute z-10 flex items-center justify-center border px-1 text-center text-[11px] leading-tight sm:text-[13px] ${
                    active ? "border-[#141414] bg-[#141414] text-white" : "border-[#c5cad3] bg-white text-[#141414]"
                  }`}
                  style={{
                    left: `${(box.x / 980) * 100}%`,
                    top: `${(box.y / 280) * 100}%`,
                    width: `${(172 / 980) * 100}%`,
                    height: `${(64 / 280) * 100}%`,
                  }}
                >
                  {stage.short}
                </button>
              );
            })}
          </div>
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#3f4651]">
          <li>Solid line: stage order</li>
          <li>Blue dashed: dependency, not a flow</li>
          <li>Selected stage is the filled box</li>
        </ul>
      </div>
      <StageCard stage={selected} />
    </div>
  );
}

function StageCard({ stage }: { stage: ChainStage }) {
  return (
    <article className="border border-[#e4e6ea] p-5" aria-live="polite">
      <p className="text-sm text-[#3f4651]">{stage.kind}</p>
      <h3 className="mt-1 text-2xl font-medium">{stage.title}</h3>
      <p className="mt-3 text-sm leading-relaxed">{stage.summary}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#3f4651]">{stage.notThis}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {stage.links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="underline underline-offset-4">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
