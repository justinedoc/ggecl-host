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

// URLs that shouldn't have Authorization header
const PUBLIC_URLS = [
  "/student/login",
  "/instructor/login",
  "/student/register",
  "/instructor/register",
];
// URLs that shouldn't trigger token refresh
const SKIP_TOKEN_REFRESH_URLS = ["/refresh", ...PUBLIC_URLS];

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

const subscribeTokenRefresh = (cb: TokenRefreshSubscriber): void => {
  tokenRefreshSubscribers.push(cb);
};

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
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
    timeout: 10000,
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    const isPublic = PUBLIC_URLS.some((url) => config.url?.includes(url));

    if (token && config.headers && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Skip token refresh for excluded URLs
      if (
        SKIP_TOKEN_REFRESH_URLS.some((url) =>
          originalRequest.url?.includes(url)
        )
      ) {
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
