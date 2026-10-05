import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ role }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loader fullscreen label="Menyiapkan ruang belajarmu..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (role && profile.role !== role) {
    const fallback =
      profile.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
