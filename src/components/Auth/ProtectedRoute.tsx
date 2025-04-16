import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
