import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <div className="relative min-h-screen flex flex-col overflow-x-clip noise-overlay">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
