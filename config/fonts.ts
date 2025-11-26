import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Playfair_Display,
  Song_Myung
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontPlayfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const fontSongMyung = Song_Myung({
  variable: "--font-songmyung",
  weight: "400",
  display: "swap",
});
