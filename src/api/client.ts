import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in environment variables");
}

// In‑memory token (we rely on HTTP‑only cookies for persistence)
let accessToken: string | null = null;

const PUBLIC_URLS = [
  "/student/login",
  "/instructor/login",
  "/student/register",
  "/instructor/register",
  "/",
];

const SKIP_TOKEN_REFRESH_URLS = [
  "/refresh",
  ...PUBLIC_URLS,
  "/student/logout",
  "/instructor/logout",
];

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

// Refresh token function – calls your refresh endpoint
const refreshAccessToken = async (instance: AxiosInstance): Promise<string> => {
  try {
    const response = await instance.post<{ token: string }>("/refresh");
    console.log("Refresh response:", response.data);
    if (!response.data.token) {
      throw new Error("No token in refresh response");
    }
    return response.data.token;
  } catch (error: AxiosError | any) {
    console.error("Token refresh failed:", error?.response);
    throw new Error("Session expired. Please log in again.");
  }
};

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
    timeout: 20000,
  });

  // Request interceptor: attach token for non‑public endpoints.
  instance.interceptors.request.use((config) => {
    const token = getAccessToken();
    const isPublic = PUBLIC_URLS.some((url) => config.url?.includes(url));
    if (token && config.headers && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor: on 401, try refreshing the token.
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
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
        originalRequest._retry = true;
        try {
          const newToken = await authProvider.refreshAccessToken();
          authProvider.setAccessToken(newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();

// --- authProvider Object ---
export const authProvider = {
  // Call /auth/session to verify that a valid session exists.
  getSession: async (): Promise<{ success: boolean; data: any }> => {
    const response = await axiosInstance.get("/auth/session");
    return response.data;
  },
  refreshAccessToken: async (): Promise<string> => {
    return refreshAccessToken(axiosInstance);
  },
  studentLogout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/student/logout");
    } catch (error) {
      console.error("Student logout failed", error);
    } finally {
      setAccessToken(null);
    }
  },
  instructorLogout: async (): Promise<void> => {
    try {
      await axiosInstance.post("/instructor/logout");
    } catch (error) {
      console.error("Instructor logout failed", error);
    } finally {
      setAccessToken(null);
    }
  },
  setAccessToken,
  getAccessToken,
};

export default axiosInstance;
