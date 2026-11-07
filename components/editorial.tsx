import Link from "next/link";
import type { ImageAsset } from "@/lib/content/images";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1120px] px-5", className)}>{children}</div>;
}

export function InkLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-3 bg-[#141414] px-4 text-[15px] text-white hover:bg-[#2a2a2a]"
    >
      {children}
      <span className="inline-block size-2 bg-[#d55e00]" aria-hidden="true" />
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="underline decoration-[#c5cad3] underline-offset-4 hover:decoration-[#141414]">
      {children}
    </Link>
  );
}

export function Figure({ image, priority = false }: { image: ImageAsset; priority?: boolean }) {
  return (
    <figure className="relative bg-[#f4f5f6]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        width={1600}
        height={900}
        className="aspect-[16/10] w-full object-cover"
        fetchPriority={priority ? "high" : "auto"}
      />
      <figcaption className="absolute right-3 bottom-3 bg-[#141414] px-2 py-1 text-xs text-white">{image.label}</figcaption>
    </figure>
  );
}

export function PageIntro({
  kicker,
  title,
  deck,
}: {
  kicker?: string;
  title: string;
  deck?: string;
}) {
  return (
    <header className="max-w-3xl">
      {kicker ? <p className="text-sm text-[#3f4651]">{kicker}</p> : null}
      <h1 className="mt-4 font-display text-[3rem] leading-[0.92] font-semibold tracking-[-0.03em] text-balance md:text-[4.6rem]">
        {title}
      </h1>
      {deck ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#3f4651]">{deck}</p> : null}
    </header>
  );
}
