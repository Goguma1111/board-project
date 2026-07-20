/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          500: "#3b6ff2",
          600: "#2f59d6",
          700: "#2647ac",
        },
      },
    },
  },
  plugins: [],
};
