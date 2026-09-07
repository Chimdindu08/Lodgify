import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Checking administrator access…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}
