import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router";
import { authProvider } from "@/api/client";
import {
  Instructor,
  InstructorSchema,
  Student,
  StudentSchema,
} from "@/types/userTypes";
import { AxiosError } from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Student | Instructor | null;
  handleLogin: (accessToken: string) => Promise<void>;
  refreshToken: () => Promise<string>;
  handleLogout: () => Promise<() => void>;
}

interface User {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Student | Instructor | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<User>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const navigate = useNavigate();

  const handleLogout = useCallback(
    async () => {
      const abortController = new AbortController();
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        await authProvider.logout(abortController.signal);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Logout error:", error);
        }
      } finally {
        authProvider.setAccessToken(null);
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }

      return () => abortController.abort();
    },
    [navigate]
  );

  const refreshToken = useCallback(async () => {
    const prevToken = authProvider.getAccessToken();
    if (prevToken) return prevToken;
    try {
      const newToken = await authProvider.refreshAccessToken();
      authProvider.setAccessToken(newToken);
      return newToken;
    } catch (error) {
      throw error;
    }
  }, [handleLogout]);

  const initializeAuth = useCallback(
    async (signal?: AbortSignal) => {
      try {
        if (state.user) return;

        setState((prev) => ({ ...prev, isLoading: true }));

        try {
          await refreshToken();
        } catch (refreshError) {
          console.log("Silent refresh failed, checking session");
        }

        const response = await authProvider.getSession(signal);

        console.log(response);
        if (!response.success) throw new Error("Session expired");

        const { id, role } = response.data;

        if (!id || !role) throw new Error("Invalid session data");

        const userData = await authProvider.getUserById(id, role, signal);

        const result =
          role === "student"
            ? StudentSchema.safeParse(userData.data)
            : InstructorSchema.safeParse(userData.data);

        if (!result.success) {
          throw new Error("Invalid user data format");
        }

        setState({
          isAuthenticated: true,
          isLoading: false,
          user: result.data,
        });
      } catch (error) {
        if (!signal?.aborted) {
          console.error("Auth initialization failed:", error);
          if (
            error instanceof AxiosError &&
            (error.response?.data?.message as string)?.includes("expired")
          ) {
            console.log("token error: ", error.response?.data?.message);
            return;
          }
          authProvider.setAccessToken(null);
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      }
    },
    [refreshToken, state.user]
  );

  const handleLogin = useCallback(
    async (accessToken: string) => {
      try {
        authProvider.setAccessToken(accessToken);
        await initializeAuth();
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [initializeAuth]
  );

  useEffect(() => {
    const abortController = new AbortController();

    initializeAuth(abortController.signal);

    // Silent refresh logic
    const refreshInterval = setInterval(async () => {
      if (state.isAuthenticated) {
        try {
          await refreshToken();
          console.log("Token refreshed");
        } catch (error) {
          console.error("error in init auth useEffect: ", error);
        }
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => {
      abortController.abort();
      clearInterval(refreshInterval);
    };
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
