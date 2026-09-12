import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PolicyProbe — Deterministic Onchain Behavioral Assertions for Hedera Harness",
  description:
    "Expected. Executed. Verified. PolicyProbe executes real onchain actions, compares observed outcomes against declared expectations, and turns mismatches into structured repair findings for Hedera Harness.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PolicyProbe — Deterministic Onchain Behavioral Assertions for Hedera Harness",
    description:
      "Expected. Executed. Verified. Infrastructure-grade postcondition verification for AI-built Hedera applications.",
    siteName: "PolicyProbe",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#080808] text-white flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
