/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: {
          primary: "#FAFAFA",
          "muted-foreground": "#A1A1AA",
        },
        primary: "#4287f5",
      },
    },
  },
  plugins: [],
};
