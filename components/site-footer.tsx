import Link from "next/link";
import { footerNav } from "@/lib/content/registry";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#e4e6ea]">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-5 py-8 text-sm text-[#3f4651] sm:flex-row sm:items-center sm:justify-between">
        <p>Macro Atlas · November 2026 edition · English only</p>
        <nav aria-label="Secondary">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
