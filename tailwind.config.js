const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair", "serif"],
        songmyung: ['"Song Myung"', "serif"],
      },
      colors: {
        "crayola-orange": "#F16F33",
        crayolaOrange: "#F16F33",
        "adult-green": "#11553F",
        adultGreen: "#11553F",
        olivine: "#ACBD6F",
        "peach-yellow": "#FCE2A9",
        peachYellow: "#FCE2A9",
        periwinkle: "#CBCBE7",
        "ultra-violet": "#595880",
        ultraViolet: "#595880",
        ivory: "#FDFAE7",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
