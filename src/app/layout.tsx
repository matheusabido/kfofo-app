import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["sans-serif"]
});

export const metadata: Metadata = {
  title: "Kfofo",
  description: "Os melhores cafofos do mundo!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body style={{...inter.style, display: "flex", flexDirection: "column", paddingBottom: "2rem"}}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
