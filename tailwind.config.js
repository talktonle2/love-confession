/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Kantumruy Pro"', '"Outfit"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
