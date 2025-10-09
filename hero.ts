import { heroui } from "@heroui/react";

export default heroui({
  prefix: "heroui",
  addCommonColors: true,
  defaultTheme: "dark",
  themes: {
    dark: {
      colors: {
        background: "#121212",
        foreground: "#ffffff",
        primary: { DEFAULT: "#D7263D", foreground: "#ffffff" },
        secondary: { DEFAULT: "#F5B301", foreground: "#121212" },
        content1: "#1E1E1E"
      }
    },
    light: {
      colors: {
        background: "#ffffff",
        foreground: "#121212",
        primary: { DEFAULT: "#D7263D", foreground: "#ffffff" },
        secondary: { DEFAULT: "#F5B301", foreground: "#121212" },
        content1: "#f4f4f4"
      }
    }
  }
});
