import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connections Archive | Play NYT Puzzles Online - Past & New",
  description: "Discover and play every NYT Connections game online! No login required. Relive past puzzles or explore new ones. Start playing now at connectionsarchive.net.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body /* className={inter.className} */>
        {/* Google Tag */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
        </body>
    </html>
  );
}
