import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import GaPageTracker from "@/components/GaPageTracker";
import { GlobalStructuredData } from "@/components/StructuredData";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DEFAULT_DESCRIPTION, SITE_URL, buildMetadata } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI Business Process Automation Consulting | Workflow & CRM Optimization | FlowOps",
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  metadataBase: new URL(SITE_URL),
  applicationName: "FlowOps",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} bg-slate-950 font-sans text-slate-100 antialiased`}>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  send_page_view: false
                });
              `}
            </Script>
            <GaPageTracker />
          </>
        ) : null}
        <GlobalStructuredData />
        <div className="layout-bg min-h-screen">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
