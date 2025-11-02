import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: ["/Logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="dns-prefetch" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.googleapis.com"
          rel="preconnect"
        />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
      </head>
      <body
        suppressHydrationWarning //added so the body will handle browser extension differences while keeping the app function normally
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Script
          defer
          src="https://02edb5380778.ap-southeast-1.captcha-sdk.awswaf.com/02edb5380778/jsapi.js"
          strategy="afterInteractive"
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <PerformanceMonitor />
          <div className="relative flex flex-col h-screen">
            <main className="flex flex-col flex-grow w-full h-full pt-0 px-0 m-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
