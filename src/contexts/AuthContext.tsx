import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router";
import { authProvider } from "@/api/client";
import {
  Instructor,
  InstructorSchema,
  Student,
  StudentSchema,
} from "@/types/userTypes";
import { parseJwt } from "@/lib/jwt";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Student | Instructor | null;
  handleLogin: (accessToken: string) => Promise<void>;
  refreshToken: () => Promise<string>;
  handleLogout: (type: "student" | "instructor") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: Student | Instructor | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const navigate = useNavigate();

  const handleLogin = useCallback(async (accessToken: string) => {
    try {
      authProvider.setAccessToken(accessToken);
      const { role } = parseJwt(accessToken);

      // Immediately set auth state while loading user data
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        isLoading: true,
      }));

      const response = await authProvider.getSession();

      const result =
        role === "student"
          ? StudentSchema.safeParse(response.data)
          : InstructorSchema.safeParse(response.data);

      if (!result.success) {
        throw new Error("Invalid user data format");
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: result.data,
      });
    } catch (error) {
      console.error("Login failed:", error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      throw error;
    }
  }, []);

  const handleLogout = useCallback(
    async (type: "student" | "instructor") => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        await authProvider[`${type}Logout`]();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        authProvider.setAccessToken(null);
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        navigate("/login");
      }
    },
    [navigate]
  );

  const refreshToken = useCallback(async () => {
    try {
      const newToken = await authProvider.refreshAccessToken();
      authProvider.setAccessToken(newToken);
      return newToken;
    } catch (error) {
      await handleLogout("student");
      throw error;
    }
  }, [handleLogout]);

  const initializeAuth = useCallback(async () => {
    try {
      const session = await authProvider.getSession();

      if (!session.success) {
        await handleLogout("student");
        return;
      }

      const { role } = parseJwt(authProvider.getAccessToken() as string);
      const result =
        role === "student"
          ? StudentSchema.safeParse(session.data)
          : InstructorSchema.safeParse(session.data);

      if (!result.success) {
        throw new Error("Session validation failed");
      }

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: result.data,
      });
    } catch (error) {
      await handleLogout("student");
    }
  }, [handleLogout]);

  useLayoutEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const contextValue = useMemo(
    () => ({
      ...state,
      handleLogin,
      refreshToken,
      handleLogout,
    }),
    [state, handleLogin, refreshToken, handleLogout]
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
