import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", {
        replace: true,
        state: { from: location },
      });
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <AuthPageLoading className="bg-opacity-none" />;
  }

  return isAuthenticated ? <>{children}</> : null;
};
