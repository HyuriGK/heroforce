import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PageLoader } from "./page-loader";
import { useAuth } from "../contexts/auth-context";

export function RequireAuth() {
  const { isInitializing, token, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <PageLoader />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireAdmin() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
