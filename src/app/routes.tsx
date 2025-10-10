import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Jobs from "@/features/jobs/Jobs";
import JobDetail from "@/features/jobs/JobDetail";
import MaterialsSettings from "@/features/materials/MaterialSettings";
import SettingsPage from "@/features/settings/SettingsPage";
import EstimatorPage from "@/features/estimator/EstimatorPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // ⬅️ critical
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/estimator", element: <EstimatorPage /> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/jobs/:id", element: <JobDetail /> },
      { path: "/materials", element: <MaterialsSettings /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);
