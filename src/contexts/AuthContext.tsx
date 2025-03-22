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

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Student | Instructor | null;
  handleLogin: (accessToken: string) => Promise<void>;
  refreshToken: () => Promise<string>;
  handleLogout: (type: "student" | "instructor") => Promise<() => void>;
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

  const handleLogout = useCallback(
    async (type: "student" | "instructor") => {
      const abortController = new AbortController();
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        await authProvider[`${type}Logout`](abortController.signal);
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
          authProvider.setAccessToken(null);
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      }
    },
    [handleLogout]
  );

  const handleLogin = useCallback(
    async (accessToken: string) => {
      try {
        authProvider.setAccessToken(accessToken);
        await initializeAuth(); // Fetch user data after login
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [initializeAuth]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const initializeWithAbort = async () => {
      try {
        await initializeAuth(abortController.signal);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Initialization error:", error);
        }
      }
    };

    initializeWithAbort();

    return () => {
      abortController.abort();
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
