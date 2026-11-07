"use client";

import { useState } from "react";

export function FramedImage({
  src,
  alt,
  crop,
  priority,
  available = true,
}: {
  src: string;
  alt: string;
  crop?: "right";
  priority?: boolean;
  available?: boolean;
}) {
  const [failed, setFailed] = useState(!available);
  if (failed) {
    return (
      <div className={`flex items-center bg-[#eceef1] px-6 py-6 ${crop === "right" ? "aspect-video" : "aspect-[16/10]"}`}>
        <p className="max-w-xl text-sm leading-relaxed text-[#3f4651]">{alt}</p>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={1600}
      height={900}
      className={`w-full object-cover ${crop === "right" ? "aspect-video" : "aspect-[16/10]"}`}
      style={crop === "right" ? { objectPosition: "72% center" } : undefined}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}
