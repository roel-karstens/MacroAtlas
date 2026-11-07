import Link from "next/link";
import { footerNav } from "@/lib/content/registry";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#d9d3c6]">
      <div className="mx-auto grid max-w-[1120px] gap-6 px-5 py-8 text-sm text-[#3f4651] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <p className="font-display text-lg tracking-[0.14em] text-[#15191f]">MACRO ATLAS</p>
          <p className="mt-2 max-w-md leading-relaxed">
            Explainers on how physical things — wells, fields, fabs and ports — reach prices. Dated snapshots, not live feeds. Educational, not investment advice.
          </p>
        </div>
        <div>
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
          <p className="mt-4 leading-relaxed">No accounts, no analytics. Calculators run in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
