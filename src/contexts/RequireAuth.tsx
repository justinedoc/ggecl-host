// RequireAuth.tsx (Enhanced)
import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, isLoading, user, navigate, location]);

  if (isLoading) return <AuthPageLoading />;
  if (!isAuthenticated || !user) return null;

  return <>{children}</>;
};
