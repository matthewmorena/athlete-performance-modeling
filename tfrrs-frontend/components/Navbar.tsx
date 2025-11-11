"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "classnames";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/teams", label: "Teams" },
    { href: "/meets", label: "Meets" },
  ];

  return (
    <nav className="border-b border-green-200 bg-green-700 text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 gap-4">
        <Link href="/" className="text-xl font-bold text-white hover:text-green-200">
          Track Exchange
        </Link>

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-green-200",
                pathname === item.href && "text-green-100 underline"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
