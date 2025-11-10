import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Track Exchange",
  description: "Trade athlete stocks, track results, and ELO ratings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
