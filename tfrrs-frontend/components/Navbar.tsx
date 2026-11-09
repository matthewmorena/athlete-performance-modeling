"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return <header className="exchange-nav">
    <Link href="/" className="exchange-brand" aria-label="Track Exchange home"><strong>TRACK<br />EXCHANGE</strong></Link>
    <nav className="exchange-nav-caption" aria-label="Primary navigation"><Link href="/">Market</Link></nav>
    <div className="exchange-global-search"><SearchBar /></div>
  </header>;
}
