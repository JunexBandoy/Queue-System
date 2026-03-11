import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "./Auth";

export const ProtectedRoute: React.FC = () => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
