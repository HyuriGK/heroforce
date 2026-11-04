import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/app-layout";
import { RequireAdmin, RequireAuth } from "./components/protected-route";
import { AuthProvider } from "./contexts/auth-context";
import { AuthPage } from "./pages/auth-page";
import { DashboardPage } from "./pages/dashboard-page";
import { ProjectFormPage } from "./pages/project-form-page";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/projects/new" element={<ProjectFormPage />} />
              <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
