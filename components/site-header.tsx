"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav } from "@/lib/content/registry";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#e4e6ea] bg-white">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-[15px] font-semibold tracking-[0.16em]" aria-label="Macro Atlas, home">
          MACRO ATLAS
        </Link>
        <nav className="hidden items-center gap-7 text-[15px] md:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              className="underline-offset-4 hover:underline aria-[current=page]:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/newsletter" className="inline-flex min-h-11 items-center bg-[#141414] px-3 text-sm text-white hover:bg-[#2a2a2a]">
            Newsletter
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center border border-[#e4e6ea] px-3 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-[#e4e6ea] px-5 py-3 md:hidden" aria-label="Primary mobile">
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-11 items-center underline-offset-4 hover:underline aria-[current=page]:underline"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
