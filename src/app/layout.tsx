import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/chakra/provider";
import { AuthProvider } from "@/providers/AuthContext";
import { AlertProvider } from "@/providers/AlertContext";

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
        <Provider>
          <AuthProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
