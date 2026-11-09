import type { Metadata } from "next";
import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Track Exchange",
  description: "Collegiate track and field results and athlete performance ratings.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
