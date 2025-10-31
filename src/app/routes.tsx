import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/features/dashboard/Dashboard";
import Jobs from "@/features/jobs/Jobs";
import JobDetail from "@/features/jobs/JobDetail";
import MaterialsSettings from "@/features/materials/MaterialSettings";
import SettingsPage from "@/features/settings/SettingsPage";
import EstimatorPage from "@/features/estimator/EstimatorPage";
import Login from "@/features/auth/Login";
import ProtectedRoute from "@/core/routing/ProtectedRoute";
import OnboardingPage from "@/features/onboarding/OnboardingPage";

export const router = createBrowserRouter([
  // Public routes (no protection)
  { path: "/login", element: <Login /> },
  { path: "/onboarding", element: <OnboardingPage /> },

  // Protected routes (require auth & onboarding complete)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/estimator", element: <EstimatorPage /> },
          { path: "/jobs", element: <Jobs /> },
          { path: "/jobs/:id", element: <JobDetail /> },
          { path: "/materials", element: <MaterialsSettings /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
