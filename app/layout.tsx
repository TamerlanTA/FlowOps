import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  axes: ["opsz"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "FlowOps - AI Automation Systems",
  description:
    "FlowOps designs and builds AI-powered automation systems for sales, operations, reporting, and internal teams.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://flowops.agency"),
  openGraph: {
    title: "FlowOps - AI Automation Systems",
    description:
      "AI automation systems for real operations: CRM workflows, AI assistants, dashboards, reporting, and business process automation.",
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
      className={`${dmSans.variable} ${dmMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
