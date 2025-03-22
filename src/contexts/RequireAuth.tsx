// RequireAuth.tsx (Enhanced)
import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading || !isAuthenticated)
    return <AuthPageLoading className="bg-opacity-none" />;

  return <>{children}</>;
};
