"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "classnames";

import SearchBar from "./SearchBar";

const navItems = [
  { href: "/", label: "Market" },
  { href: "/teams", label: "Teams" },
  { href: "/meets", label: "Meets" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-panel/95 backdrop-blur">
      <div className="mx-auto flex min-h-[68px] max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Track Exchange home">
          <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-extrabold text-accent-ink">
            TX
          </span>
          <span className="hidden font-bold tracking-tight text-foreground sm:inline">Track Exchange</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto min-w-0 flex-1 sm:max-w-sm">
          <SearchBar />
        </div>

        <select
          aria-label="Season"
          defaultValue="2026-outdoor"
          className="hidden rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent/50 lg:block"
        >
          <option value="2026-outdoor">2026 Outdoor</option>
          <option value="2026-indoor">2026 Indoor</option>
        </select>
      </div>
    </header>
  );
}
