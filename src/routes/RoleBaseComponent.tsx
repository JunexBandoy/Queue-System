// src/role/RoleBasedPayments.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { AdminView } from "../module/Payments/AdminView";
import { SubAdminView } from "../module/Payments/SubAdminView";

export default function RoleBasedPayments() {
  const { role, loading } = useAuth() as { role?: string; loading?: boolean };
  if (loading) return <div className="p-6">Loading…</div>;

  const r = role?.toString().trim().toLowerCase();
  if (r === "admin") return <AdminView />;
  if (r === "subadmin") return <SubAdminView />;

  // Fallback for unknown roles
  return <Navigate to="/login" replace />;
}
