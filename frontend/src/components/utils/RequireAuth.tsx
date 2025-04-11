import AuthPageLoading from "@/components/auth/_components/AuthPageLoading";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const RequireAuth = ({
  children,
  isPending,
}: {
  children: React.ReactNode;
  isPending?: boolean;
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !isLoading && !isAuthenticated) {
      navigate("/", {
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, isPending]);

  if (isLoading || isPending) {
    return <AuthPageLoading />;
  }

  return isAuthenticated ? <>{children}</> : null;
};
