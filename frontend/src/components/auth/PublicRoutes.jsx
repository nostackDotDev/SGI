import { useAuth } from "@/core/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../layout/Loader";

export default function PublicRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;

  if (isAuthenticated) {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
}
