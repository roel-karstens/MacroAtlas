"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { successiveLevels } from "@/lib/data/food-index";
import { formatNumber } from "@/lib/format";
import { parseDecimal } from "@/lib/models/parse";

const START = 100;

export function FoodLevelSketch() {
  const [first, setFirst] = useState("10");
  const [second, setSecond] = useState("2");
  const parsedFirst = parseDecimal(first);
  const parsedSecond = parseDecimal(second);
  const firstValue = parsedFirst.ok ? parsedFirst.value : null;
  const secondValue = parsedSecond.ok ? parsedSecond.value : null;
  const valid =
    firstValue != null &&
    secondValue != null &&
    firstValue > -100 &&
    secondValue > -100 &&
    Math.abs(firstValue) <= 100 &&
    Math.abs(secondValue) <= 100;
  const levels = valid ? successiveLevels(START, [firstValue, secondValue]) : null;
  const takeaway =
    levels == null || secondValue == null || firstValue == null
      ? "Enter two changes greater than −100 and at most 100 percent."
      : levels[2] > levels[0] && secondValue >= 0
        ? `The second step is ${secondValue < firstValue ? "a slower rise" : "another rise"}, and the level is still above where it started. The bill has not fallen.`
        : levels[2] < levels[1]
          ? "The second step is a fall, so the level drops from the step before it. That is the only way this sketch gets cheaper."
          : "The level is back where it started only if the two changes cancel. Check the table.";

  return (
    <form className="mt-6 border border-[#e4e6ea] p-5" onSubmit={(event) => event.preventDefault()}>
      <p className="text-sm text-[#3f4651]">Illustration, not an official index</p>
      <h3 className="mt-1 font-display text-4xl leading-none font-semibold">A slower rise is not a lower price</h3>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3f4651]">
        Start at 100, a round teaching level. It is not the FAO base and not a Eurostat base. Each box is a percent change from the step before, not a new price you copied from a market.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="food-change-1">First change, percent</Label>
          <Input
            id="food-change-1"
            inputMode="decimal"
            autoComplete="off"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
            className="mt-2 h-11 rounded-none px-3 text-base md:text-base"
          />
        </div>
        <div>
          <Label htmlFor="food-change-2">Next change, percent</Label>
          <Input
            id="food-change-2"
            inputMode="decimal"
            autoComplete="off"
            value={second}
            onChange={(event) => setSecond(event.target.value)}
            className="mt-2 h-11 rounded-none px-3 text-base md:text-base"
          />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed" aria-live="polite">
        {takeaway}
      </p>
      {levels ? (
        <div className="mt-4 overflow-auto border border-[#e4e6ea]">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Three illustrative levels from a start of 100 and two percent changes</caption>
            <thead>
              <tr className="border-b border-[#e4e6ea]">
                <th className="px-3 py-2 font-medium">Step</th>
                <th className="px-3 py-2 font-medium">Change</th>
                <th className="px-3 py-2 font-medium">Level</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal">Start</th>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2 tabular-nums">{formatNumber(levels[0], 1)}</td>
              </tr>
              <tr className="border-b border-[#e4e6ea]">
                <th scope="row" className="px-3 py-2 font-normal">After first change</th>
                <td className="px-3 py-2 tabular-nums">{formatNumber(parsedFirst.ok ? parsedFirst.value : 0, 1)}%</td>
                <td className="px-3 py-2 tabular-nums">{formatNumber(levels[1], 1)}</td>
              </tr>
              <tr>
                <th scope="row" className="px-3 py-2 font-normal">After next change</th>
                <td className="px-3 py-2 tabular-nums">{formatNumber(parsedSecond.ok ? parsedSecond.value : 0, 1)}%</td>
                <td className="px-3 py-2 tabular-nums">{formatNumber(levels[2], 1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </form>
  );
}
