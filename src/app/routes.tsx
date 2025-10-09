import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Jobs from "@/features/jobs/Jobs";
import MaterialsSettings from "@/features/materials/MaterialSettings";
import SettingsPage from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // ⬅️ critical
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/materials", element: <MaterialsSettings /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
