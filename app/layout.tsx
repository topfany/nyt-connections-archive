import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connections Archive: Play NYT Games Online | ConnectionsArchive.net",
  description: "Discover and play every NYT Connections game online! No login required. Relive past puzzles or explore new ones. Start playing now at connectionsarchive.net.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
