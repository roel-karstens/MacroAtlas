import { paddedDomain } from "@/lib/charts/scale";

export function StaticLine({
  values,
  label,
  caption,
}: {
  values: number[];
  label: string;
  caption: string;
}) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length < 2) return null;
  const domain = paddedDomain(finite);
  const width = 320;
  const height = 180;
  const pad = 16;
  const xOf = (index: number) => pad + (index / (finite.length - 1)) * (width - pad * 2);
  const yOf = (value: number) => {
    const span = domain.max - domain.min || 1;
    return pad + (1 - (value - domain.min) / span) * (height - pad * 2);
  };
  const d = finite.map((value, index) => `${index === 0 ? "M" : "L"}${xOf(index).toFixed(1)} ${yOf(value).toFixed(1)}`).join(" ");
  const last = finite[finite.length - 1];

  return (
    <figure>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}. Solid observed line. ${caption}`} className="aspect-[16/9] w-full bg-[#f7f8f9]">
        <path d={d} fill="none" stroke="#0072B2" strokeWidth="2" />
        <circle cx={xOf(finite.length - 1)} cy={yOf(last)} r="3" fill="#0072B2" />
        <text x={12} y={24} fontSize="12" fill="#141414">
          {label}
        </text>
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-[#3f4651]">{caption}</figcaption>
    </figure>
  );
}
