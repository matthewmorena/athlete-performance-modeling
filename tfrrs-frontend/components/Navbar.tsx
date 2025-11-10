"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "classnames";

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/athletes/12345", label: "Athletes" },
    { href: "/teams", label: "Teams" },
    { href: "/meets", label: "Meets" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          TrackTrader
        </Link>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href && "text-blue-600"
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
