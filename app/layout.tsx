import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";

import GaPageTracker from "@/components/GaPageTracker";
import { GlobalStructuredData } from "@/components/StructuredData";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DEFAULT_DESCRIPTION, SITE_URL, buildMetadata } from "@/lib/seo";
import CursorAndProgress from "@/components/CursorAndProgress";

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
  themeColor: "#06060e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`scroll-smooth ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-[#06060e] text-[#e8eaf2] antialiased">
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
        <CursorAndProgress />
        <div className="layout-bg min-h-screen">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
