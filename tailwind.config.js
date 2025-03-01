/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: {
          primary: {
            foreground: "#FAFAFA",
          },
          "muted-foreground": "#A1A1AA",
        },
        primary: {
          100: "#18181B",
          200: "#151515",
        },
      },
    },
  },
  plugins: [],
};
