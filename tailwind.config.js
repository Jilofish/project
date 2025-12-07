/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",         // ← IMPORTANT!
    "./src/**/*.{js,jsx}",  // scan all components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
