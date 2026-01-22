import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoardGameCulture - India's Board Game Community",
  description: "Discover board game events, discussions, and connect with the Indian board gaming community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-stone-900 transition-colors`}>
        {children}
      </body>
    </html>
  );
}
