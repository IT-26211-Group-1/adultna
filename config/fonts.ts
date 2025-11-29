import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Playfair_Display,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["monospace"],
});

export const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
  style: ["normal"],
  display: "swap",
  preload: false,
  fallback: ["serif"],
  adjustFontFallback: true,
});
