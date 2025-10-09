import { RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { router } from "./routes";

export default function App() {
  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  );
}
