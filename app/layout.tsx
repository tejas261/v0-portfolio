import type React from "react";
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tejas M | Full Stack Developer • AI Engineer",
  description: "Portfolio of Tejas M - Graduate SDE at Fynd",
  icons: {
    icon: [
      {
        url: "/favicon.gif",
        type: "video/gif",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${_syne.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
