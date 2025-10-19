import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "../styles/globals.css";
import { Toaster } from "sonner";
import { SupabaseProvider } from "@/core/providers/SupabaseProvider";

function Root() {
  const [theme, setTheme] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <HeroUIProvider>
      <SupabaseProvider>
        <main className={`${theme} text-foreground bg-background min-h-screen`}>
          <Toaster richColors position="bottom-right" />
          <App />
        </main>
      </SupabaseProvider>
    </HeroUIProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
