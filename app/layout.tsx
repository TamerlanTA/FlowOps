import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
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
      className={`${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body style={{ background: "#000000" }} suppressHydrationWarning>
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
