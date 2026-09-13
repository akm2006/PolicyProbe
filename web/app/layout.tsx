import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
    // ?v= busts the browser's favicon cache after the recolor
    icon: "/favicon.svg?v=2",
    shortcut: "/favicon.svg?v=2",
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
    // suppressHydrationWarning: the docs theme switch sets a class on <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
