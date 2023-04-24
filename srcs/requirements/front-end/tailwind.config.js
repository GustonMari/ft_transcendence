/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
            'background': "url('/usr/front-end/public/back.png')",
            'background-blur' : "url('/usr/front-end/public/back-blur.jpg')",
        }
    },
  },
  plugins: [],
}

