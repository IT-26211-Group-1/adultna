import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans, fontPlayfair } from "@/config/fonts";

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
      <body
        suppressHydrationWarning //added so the body will handle browser extension differences while keeping the app function normally
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased m-0 p-0",
          fontSans.variable,
          fontPlayfair.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
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
