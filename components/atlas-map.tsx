"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gulf from "@/data/geo/gulf-land.json";
import { Button } from "@/components/ui/button";
import { connections, connectionsFor, locations, type Location } from "@/lib/content/geography";
import { entityVisible, MAP_HEIGHT, MAP_WIDTH, project, type MapFilterKey } from "@/lib/map/project";

const filtersDefault: Record<MapFilterKey, boolean> = {
  terminal: true,
  pipeline: true,
  processing: true,
  corridor: true,
};

const filterLabels: Record<MapFilterKey, string> = {
  terminal: "Terminals",
  pipeline: "Pipelines",
  processing: "Processing",
  corridor: "Shipping corridor",
};

type Feature = { geometry: { coordinates: number[][][] } };

function shapeFor(location: Location) {
  if (location.categories.includes("terminal")) return "square";
  if (location.categories.includes("corridor") || location.categories.includes("pipeline")) return "diamond";
  return "circle";
}

export function AtlasMap() {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [filters, setFilters] = useState(filtersDefault);
  const [selectedId, setSelectedId] = useState<string>("hormuz");
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      setView((current) => ({ ...current, k: Math.min(6, Math.max(1, current.k * factor)) }));
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  const visible = locations.filter(
    (location) => location.lat != null && location.lon != null && entityVisible(location.categories, filters),
  );
  const selected = locations.find((location) => location.id === selectedId) ?? null;
  const land = (gulf.features as Feature[]).map((feature) =>
    feature.geometry.coordinates
      .map((ring) =>
        ring
          .map((pair, index) => {
            const point = project(pair[0], pair[1]);
            return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
          })
          .join(" "),
      )
      .join(" "),
  );

  function pan(dx: number, dy: number) {
    setView((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <div>
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm font-medium">Show</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(filterLabels) as MapFilterKey[]).map((key) => (
              <label key={key} className="inline-flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={() => setFilters((current) => ({ ...current, [key]: !current[key] }))}
                />
                {filterLabels[key]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mb-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-11 rounded-none px-3" onClick={() => setView((v) => ({ ...v, k: Math.min(6, v.k * 1.25) }))}>
            Zoom in
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-3" onClick={() => setView((v) => ({ ...v, k: Math.max(1, v.k / 1.25) }))}>
            Zoom out
          </Button>
          <Button type="button" variant="outline" className="h-11 rounded-none px-3" onClick={() => setView({ x: 0, y: 0, k: 1 })}>
            Reset view
          </Button>
        </div>
        <div
          ref={viewport}
          className="relative aspect-[1000/760] overflow-hidden border border-[#e4e6ea] bg-[#e7eef2]"
          style={{ touchAction: "none" }}
          tabIndex={0}
          role="application"
          aria-label="Schematic map of the Persian Gulf. Arrow keys pan. Plus and minus zoom. Not for navigation."
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") pan(24, 0);
            if (event.key === "ArrowRight") pan(-24, 0);
            if (event.key === "ArrowUp") pan(0, 24);
            if (event.key === "ArrowDown") pan(0, -24);
            if (event.key === "+" || event.key === "=") setView((v) => ({ ...v, k: Math.min(6, v.k * 1.2) }));
            if (event.key === "-" || event.key === "_") setView((v) => ({ ...v, k: Math.max(1, v.k / 1.2) }));
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "=", "_"].includes(event.key)) {
              event.preventDefault();
            }
          }}
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = { px: event.clientX, py: event.clientY, x: view.x, y: view.y };
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            const start = drag.current;
            setView((current) => ({
              ...current,
              x: start.x + (event.clientX - start.px),
              y: start.y + (event.clientY - start.py),
            }));
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: "center center" }}
          >
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="h-full w-full" aria-hidden="true">
              {land.map((d, index) => (
                <path key={index} d={d} fill="#f7f8f9" stroke="#d5d8de" strokeWidth={0.6} />
              ))}
              {filters.corridor
                ? connections
                    .filter((connection) => connection.geometry === "corridor" && connection.path)
                    .map((connection) => {
                      const d = connection.path!
                        .map((point, index) => {
                          const projected = project(point.lon, point.lat);
                          return `${index === 0 ? "M" : "L"}${projected.x.toFixed(1)} ${projected.y.toFixed(1)}`;
                        })
                        .join(" ");
                      return (
                        <path key={connection.id} d={d} fill="none" stroke="#0072B2" strokeWidth={3} strokeDasharray="8 6" />
                      );
                    })
                : null}
              {filters.pipeline
                ? connections
                    .filter((connection) => connection.geometry === "straight")
                    .map((connection) => {
                      const from = locations.find((location) => location.id === connection.fromId);
                      const to = locations.find((location) => location.id === connection.toId);
                      if (!from?.lat || !from.lon || !to?.lat || !to.lon) return null;
                      const a = project(from.lon, from.lat);
                      const b = project(to.lon, to.lat);
                      return (
                        <line
                          key={connection.id}
                          x1={a.x}
                          y1={a.y}
                          x2={b.x}
                          y2={b.y}
                          stroke="#D55E00"
                          strokeWidth={2}
                          strokeDasharray="7 5"
                        />
                      );
                    })
                : null}
              <text x="620" y="150" fontSize="13" fill="#8b93a0">
                Iran
              </text>
              <text x="250" y="520" fontSize="13" fill="#8b93a0">
                Saudi Arabia
              </text>
              <text x="430" y="430" fontSize="13" fill="#8b93a0">
                Qatar
              </text>
              <text x="560" y="620" fontSize="13" fill="#8b93a0">
                UAE
              </text>
            </svg>
            {visible.map((location) => {
              const point = project(location.lon as number, location.lat as number);
              const selectedNow = location.id === selectedId;
              const shape = shapeFor(location);
              return (
                <button
                  key={location.id}
                  type="button"
                  className="absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{
                    left: `${(point.x / MAP_WIDTH) * 100}%`,
                    top: `${(point.y / MAP_HEIGHT) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${1 / view.k})`,
                  }}
                  aria-pressed={selectedNow}
                  aria-label={`${location.name}, ${location.country}`}
                  onClick={() => setSelectedId(location.id)}
                >
                  <span
                    className={
                      shape === "circle"
                        ? `size-3 rounded-full border-2 border-[#141414] ${selectedNow ? "bg-[#141414]" : "bg-white"}`
                        : shape === "diamond"
                          ? `size-3 rotate-45 border-2 border-[#141414] ${selectedNow ? "bg-[#141414]" : "bg-white"}`
                          : `size-3 border-2 border-[#141414] ${selectedNow ? "bg-[#141414]" : "bg-white"}`
                    }
                  />
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#3f4651]">
          Self-contained schematic. Coastline from Natural Earth 1:10m land, public domain, clipped to this window on 7 November 2026. Equirectangular, not a navigational chart. The corridor and the Habshan–Fujairah line are schematic. No AIS and no live traffic. Country names are orientation labels.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#3f4651]">
          <li>Square: terminal</li>
          <li>Diamond: pipeline or corridor</li>
          <li>Circle: processing</li>
          <li>Blue dashed: sea passage</li>
          <li>Vermilion dashed: pipeline schematic</li>
        </ul>
      </div>
      <div className="border border-[#e4e6ea] p-5">
        <h2 className="text-sm font-medium">Places</h2>
        <ul className="mt-2 max-h-64 overflow-auto border-b border-[#e4e6ea] pb-3">
          {locations.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-3 text-left text-sm underline-offset-4 hover:underline aria-pressed:font-medium"
                aria-pressed={location.id === selectedId}
                onClick={() => setSelectedId(location.id)}
              >
                <span>{location.name}</span>
                <span className="text-[#3f4651]">{location.lat == null ? "Off map" : shapeFor(location)}</span>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <article aria-live="polite">
            <p className="text-sm text-[#3f4651]">{selected.country}</p>
            <h2 className="mt-1 font-display text-4xl leading-none font-semibold">{selected.name}</h2>
            <p className="mt-4 text-sm leading-relaxed">{selected.summary}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-[#3f4651]">Roles</dt>
              <dd>{selected.roles.join(", ")}</dd>
              <dt className="text-[#3f4651]">Coordinates</dt>
              <dd>
                {selected.lat == null || selected.lon == null
                  ? "Not plotted."
                  : `${selected.lat.toFixed(4)}°, ${selected.lon.toFixed(4)}°`}
                <span className="block text-[#3f4651]">{selected.coordinateStatus.replaceAll("_", " ")}</span>
              </dd>
              <dt className="text-[#3f4651]">Capacity</dt>
              <dd>{selected.capacityNote}</dd>
              <dt className="text-[#3f4651]">Flow</dt>
              <dd>Not stated.</dd>
              <dt className="text-[#3f4651]">Retrieved</dt>
              <dd>{selected.retrieved}</dd>
            </dl>
            <p className="mt-4 text-sm">
              <a className="underline underline-offset-4" href={selected.sourceUrl}>
                Coordinate source
              </a>
            </p>
            {connectionsFor(selected.id).length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm">
                {connectionsFor(selected.id).map((connection) => (
                  <li key={connection.id}>
                    <p className="font-medium">{connection.name}</p>
                    <p className="text-[#3f4651]">
                      {connection.mode} · {connection.product} · {connection.estimateStatus.replaceAll("_", " ")} · capacity not stated · flow not stated
                    </p>
                    <p className="mt-1">{connection.note}</p>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-5 flex flex-col items-start gap-3">
              <Link href="/topics/energy/the-hormuz-question" className="underline underline-offset-4">
                Read the Hormuz question
              </Link>
              <Link href="/models/oil-exposure" className="underline underline-offset-4">
                Open the oil exposure model
              </Link>
            </div>
          </article>
        ) : (
          <p className="mt-4">Select a place.</p>
        )}
      </div>
    </div>
  );
}
