import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { authProvider } from "@/api/client";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogin: (accessToken: string) => void;
  refreshToken: () => Promise<string>;
  handleLogout: (type: "student" | "instructor") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Prevent duplicate initialization (e.g., due to React Strict Mode in development)
  const hasInitialized = useRef(false);

  const clearRefreshTimeout = () => {
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
  };

  interface JwtPayloadExtended {
    exp: number;
    id: string;
    role: string;
  }

  // Simple JWT parser to extract expiration (exp) value.
  const parseJwt = (token: string): JwtPayloadExtended => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return { exp: 0, id: "", role: "" };
    }
  };

  // Schedule a token refresh before it expires (with a 5‑minute buffer)
  const scheduleTokenRefresh = useCallback((expiresInMs: number) => {
    clearRefreshTimeout();
    const buffer = 300000; // 5 minutes
    const delay = Math.max(0, expiresInMs - buffer);
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const newToken = await authProvider.refreshAccessToken();
        // Use handleLogin to update token and schedule the next refresh.
        handleLogin(newToken);
      } catch (error) {
        console.error("Auto-refresh failed:", error);
        setIsAuthenticated(false);
      }
    }, delay);
  }, []);

  // handleLogin: store the token, schedule a refresh, and mark authenticated.
  const handleLogin = useCallback(
    (accessToken: string) => {
      authProvider.setAccessToken(accessToken);
      setIsAuthenticated(true);
      const { exp } = parseJwt(accessToken);
      if (exp) {
        const expiresInMs = exp * 1000 - Date.now();
        if (expiresInMs > 0) {
          scheduleTokenRefresh(expiresInMs);
        }
      }
    },
    [scheduleTokenRefresh]
  );

  const handleLogout = useCallback(async (type: "student" | "instructor") => {
    try {
      if (type === "student") {
        await authProvider.studentLogout();
      } else {
        await authProvider.instructorLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authProvider.setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // On initialization, check the session then refresh token if session exists.
  // Since the session endpoint does not return an access token, we call refresh.
  const initializeAuth = useCallback(async () => {
    try {
      const session = await authProvider.getSession();
      console.log("Session response:", session);
      if (session.success) {
        const newToken = await authProvider.refreshAccessToken();
        handleLogin(newToken);
        const { role } = parseJwt(newToken);
        navigate(`/${role}/dashboard`);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(
        "Session initialization failed:",
        (error as AxiosError).response
      );
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [handleLogin, navigate]);

  useEffect(() => {
    if (hasInitialized.current) return; // Prevent duplicate initialization
    hasInitialized.current = true;
    initializeAuth();
    return () => clearRefreshTimeout();
  }, [initializeAuth]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      handleLogin,
      refreshToken: authProvider.refreshAccessToken,
      handleLogout,
    }),
    [isAuthenticated, isLoading, handleLogin, handleLogout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
