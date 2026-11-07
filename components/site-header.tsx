"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/lib/content/registry";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="border-b border-[#d9d3c6] bg-[#f6f3ec]">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-display text-[22px] font-semibold tracking-[0.14em]" aria-label="Macro Atlas, home">
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
        <button
          ref={menuButton}
          type="button"
          className="inline-flex min-h-11 items-center border border-[#d9d3c6] px-3 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-[#d9d3c6] px-5 py-3 md:hidden" aria-label="Primary mobile">
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
