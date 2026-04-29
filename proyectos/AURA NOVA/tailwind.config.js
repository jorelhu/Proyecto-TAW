/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1F44",   // azul oscuro
        secondary: "#3B82F6", // azul claro
        accent: "#F59E0B",    // color complementario (amarillo/naranja)
      },
    },
  },
  plugins: [],
}