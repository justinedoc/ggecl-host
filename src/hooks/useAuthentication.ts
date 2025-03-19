import { useState, useEffect, useCallback } from "react";
import { authProvider, getAccessToken } from "@/api/client";

export const useAuthentication = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          const newToken = await authProvider.refreshAccessToken();
          authProvider.setAccessToken(newToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getAccessToken();
      setIsAuthenticated(Boolean(token));
    };

    const intervalId = setInterval(checkAuthStatus, 50000);
    return () => clearInterval(intervalId);
  }, []);

  const studentLogout = useCallback(async () => {
    return authProvider.studentLogout();
  }, []);

  const instructorLogout = useCallback(async () => {
    return authProvider.studentLogout();
  }, []);

  const refreshAccessToken = useCallback(async () => {
    return authProvider.refreshAccessToken();
  }, []);

  const setAccessToken = useCallback((token: string) => {
    authProvider.setAccessToken(token);
    setIsAuthenticated(!!token);
  }, []);

  return {
    isLoading,
    isAuthenticated,
    getAccessToken: authProvider.getAccessToken,
    setAccessToken,
    studentLogout,
    instructorLogout,
    refreshAccessToken,
  };
};
