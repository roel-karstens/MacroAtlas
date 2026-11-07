"use client";

import { useState } from "react";
import Link from "next/link";
import { foodMainSteps, foodShocks, foodStages, stageById } from "@/lib/content/food-chain";

export function FoodChain() {
  const [selectedId, setSelectedId] = useState("production");
  const selected = stageById(selectedId) ?? foodStages[0];
  const steps = foodMainSteps.map((id) => stageById(id)!);

  return (
    <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
      <div className="min-w-0">
        <p className="text-sm leading-relaxed text-[#3f4651]">
          Five questions, in order. A drought, a ban, an input shock, a closed route, or a war is only a reason to start at one of them. Nothing here is a measured flow or a tonne.
        </p>
        <div className="mt-4 flex min-w-0 gap-2 overflow-x-auto pb-1" role="group" aria-label="Path from a world price to the shop">
          {steps.map((stage, index) => (
            <div key={stage.id} className="flex shrink-0 items-center gap-2">
              <StageButton stageId={stage.id} label={stage.short} active={stage.id === selectedId} onSelect={setSelectedId} />
              {index < steps.length - 1 ? <span aria-hidden="true" className="text-[#3f4651]">→</span> : null}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Kind of shock, not a measured flow">
          {foodShocks.map((shock) => (
            <StageButton
              key={shock.id}
              stageId={shock.stepId}
              label={shock.label}
              active={false}
              dashed
              onSelect={() => setSelectedId(shock.stepId)}
            />
          ))}
        </div>
      </div>
      <article className="border border-[#e4e6ea] p-5" aria-live="polite">
        <p className="text-sm text-[#3f4651]">Question {foodMainSteps.indexOf(selected.id) + 1} of {foodMainSteps.length}</p>
        <h3 className="mt-1 font-display text-4xl leading-none font-semibold">{selected.title}</h3>
        <p className="mt-3 text-sm font-medium leading-relaxed">{selected.question}</p>
        <p className="mt-3 text-sm leading-relaxed">{selected.summary}</p>
        <ul className="mt-4 space-y-2 text-sm text-[#3f4651]">
          {foodShocks
            .filter((shock) => shock.stepId === selected.id)
            .map((shock) => (
              <li key={shock.id}>{shock.summary}</li>
            ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-[#3f4651]">{selected.notThis}</p>
        {selected.links.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {selected.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </div>
  );
}

function StageButton({
  stageId,
  label,
  active,
  dashed,
  onSelect,
}: {
  stageId: string;
  label: string;
  active: boolean;
  dashed?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(stageId)}
      className={`inline-flex min-h-11 items-center border px-3 text-sm ${
        active ? "border-[#141414] bg-[#141414] text-white" : "border-[#c5cad3] bg-white text-[#141414]"
      } ${dashed && !active ? "border-dashed" : ""}`}
    >
      {label}
    </button>
  );
}
