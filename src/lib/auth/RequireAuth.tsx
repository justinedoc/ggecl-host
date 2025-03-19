import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";
import { useAuth } from "@/lib/auth/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) return <AuthPageLoading />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};
