"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/contributions", label: "Contributions" },
  { href: "/admin/disbursements", label: "Disbursements" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="mt-6 flex flex-wrap gap-1 border-b border-slate-200">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-slate-500 hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
