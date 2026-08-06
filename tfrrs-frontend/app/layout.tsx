import type { Metadata } from "next";
import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Track Exchange",
  description: "Explore athlete results, ELO ratings, and performance momentum.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-69px)]">{children}</main>
      </body>
    </html>
  );
}
