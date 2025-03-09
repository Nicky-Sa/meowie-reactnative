import type { Config } from "tailwindcss";

export default {
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
          300: "#262626",
          400: "#171717",
        },
      },
      screens: {
        xs: "380px",
      },
    },
  },
  plugins: [],
} satisfies Config;
