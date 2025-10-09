import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
