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
      // fontFamily: {
      //   sans: ["var(--font-sans)"],
      //   mono: ["var(--font-mono)"],
      // },
      colors: {
        crayolaOrange: "#F16F33",
        adultGreen: "#11553F",
        olivine: "#ACBD6F",
        peachYellow: "#FCE2A9",
        periwinkle: "#CBCBE7",
        ultraViolet: "#595880",
        ivory: "#FDFAE7",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
