/** @type {import('postcss').ProcessOptions} */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifySelectors: true,
              },
            ],
          },
        }
      : {}),
  },
};
