import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type TokenRefreshSubscriber = (token: string) => void;

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in environment variables");
}

// --- Token Management ---
let accessToken: string | null = null;
let isRefreshing = false;
let tokenRefreshSubscribers: TokenRefreshSubscriber[] = [];

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

const subscribeTokenRefresh = (cb: TokenRefreshSubscriber): void => {
  tokenRefreshSubscribers.push(cb);
};

/**
 * Notify all waiting subscribers with the new token.
 */
const onRefreshed = (token: string): void => {
  tokenRefreshSubscribers.forEach((cb) => cb(token));
  tokenRefreshSubscribers = [];
};

// --- Axios Instance and Interceptors ---

const refreshAccessToken = async (instance: AxiosInstance): Promise<string> => {
  try {
    const response = await instance.post<{ accessToken: string }>(
      "/refresh",
      {}
    );
    if (!response.data.accessToken) {
      throw new Error("Invalid response structure");
    }
    return response.data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw new Error("Session expired. Please log in again.");
  }
};

export const createAuthenticatedAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request interceptor: attach the access token if available
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Response interceptor: handle 401 errors by attempting a token refresh
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (originalRequest.url?.includes("/refresh")) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(instance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken(instance);
          setAccessToken(newToken);
          onRefreshed(newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAuthenticatedAxiosInstance();

// --- Auth Provider Helpers ---

export const authProvider = {
  getAccessToken: (): string | null => getAccessToken(),
  setAccessToken: (token: string): void => setAccessToken(token),
  studentLogout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/student/logout", {});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAccessToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
  instructorLogout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/instructor/logout", {});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAccessToken(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
  refreshAccessToken: async (): Promise<string> => {
    return refreshAccessToken(axiosInstance);
  },
};

export default axiosInstance;
