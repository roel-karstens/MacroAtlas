export function ScenarioFan({ caption }: { caption: string }) {
  return (
    <figure>
      <svg
        viewBox="0 0 440 200"
        role="img"
        aria-label="Illustrative sketch with no numeric scale. A solid baseline splits into Scenario A, a dashed line with a square, and Scenario B, a dashed line with a diamond."
        className="h-auto w-full"
      >
        <line x1="28" y1="104" x2="190" y2="104" stroke="#141414" strokeWidth="2" />
        <text x="28" y="94" fontSize="12" fill="#141414">
          Sketch baseline
        </text>
        <path d="M190 104 C 250 104, 280 72, 400 48" fill="none" stroke="#009E73" strokeWidth="2" strokeDasharray="6 5" />
        <rect x="394" y="44" width="8" height="8" fill="#009E73" />
        <text x="300" y="36" fontSize="13" fill="#141414">
          Scenario A
        </text>
        <path d="M190 104 C 250 104, 280 140, 400 164" fill="none" stroke="#D55E00" strokeWidth="2" strokeDasharray="6 5" />
        <polygon points="398,164 404,170 398,176 392,170" fill="#D55E00" />
        <text x="300" y="190" fontSize="13" fill="#141414">
          Scenario B
        </text>
      </svg>
      <figcaption className="mt-2 text-sm leading-relaxed text-[#3f4651]">{caption}</figcaption>
    </figure>
  );
}
