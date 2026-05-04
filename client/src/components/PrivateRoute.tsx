import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import type { UserRole } from "../types";

export function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { user, token } = useAppSelector((s) => s.auth);
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
}
