/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ef4444",   // rouge doux (tu peux changer)
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
