/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts, tsx}",
    "./src/components/*",
    "./src/pages/*",
    "./src/App.tsx",
  ],
  theme: {
    fontFamily: {
        open: ['"Open Sans"', "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
}
