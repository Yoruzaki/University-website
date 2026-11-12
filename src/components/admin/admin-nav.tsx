"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/news", label: "Actualités" },
  { href: "/admin/programs", label: "Programmes" },
  { href: "/admin/faculty", label: "Enseignants" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/menu", label: "Navigation" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav className="flex flex-col border-t border-white/15">
      {NAV.map((item, i) => {
        const on = active(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className={`group grid grid-cols-[30px_1fr_auto] items-center border-b border-white/15 py-3.5 font-[var(--display)] text-[13px] font-medium transition-all ${
              on ? "text-lime" : "text-white/80 hover:ps-1.5 hover:text-white"
            }`}
          >
            <span className={`text-[9px] ${on ? "text-lime" : "text-lime/70"}`}>{String(i + 1).padStart(2, "0")}</span>
            {item.label}
            <span className={`text-xs transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>↗</span>
          </Link>
        );
      })}
    </nav>
  );
}
