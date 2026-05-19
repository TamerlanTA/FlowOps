import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FlowOps OS - AI Operations Platform",
  description:
    "FlowOps OS audits messy operations, identifies automation opportunities, deploys packaged AI systems, and maintains them through recurring AI operations subscriptions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowops.agency"),
  openGraph: {
    title: "FlowOps OS - AI Operations Platform",
    description:
      "An AI operations system for companies running on manual work, disconnected tools, slow follow-ups, and reporting gaps.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body style={{ background: "#000000" }} suppressHydrationWarning>
        <Preloader />
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
