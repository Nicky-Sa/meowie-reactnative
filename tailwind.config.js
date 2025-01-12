/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4287f5",
      },
    },
  },
  plugins: [],
};
