import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../../stores/authStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (__DEV__) {
      console.log("[API request]", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API request error]", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(
        "[API response]",
        response.config.method?.toUpperCase(),
        response.config.url,
        response.status,
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (__DEV__) {
      console.error(
        "[API response error]",
        error.config?.method?.toUpperCase(),
        error.config?.url,
        error.response?.status,
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setAccessToken, setIsAuthenticated, logout } =
          useAuthStore.getState();

        if (!refreshToken) {
          logout();
          throw new Error("Missing refresh token");
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { accessToken: newAccessToken } = response.data as {
          accessToken: string;
        };

        setAccessToken(newAccessToken);
        setIsAuthenticated(true);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        const { logout } = useAuthStore.getState();
        logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.error("[API] Access denied");
    }

    if (error.response?.status === 404) {
      console.error("[API] Resource not found");
    }

    if (error.response?.status === 500) {
      console.error("[API] Internal server error");
    }

    if (error.response?.status === 503) {
      console.error("[API] Service unavailable");
    }

    if (error.message === "Network Error") {
      console.error("[API] Network error");
    }

    if (error.code === "ECONNABORTED") {
      console.error("[API] Request timeout");
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;

      if (typeof data.message === "string") {
        return data.message;
      }

      if (typeof data.detail === "string") {
        return data.detail;
      }

      if (data.detail) {
        return JSON.stringify(data.detail);
      }

      if (typeof data.error === "string") {
        return data.error;
      }
    }

    if (error.message === "Network Error") {
      return "Erro de rede. Verifique sua conexao.";
    }

    if (error.code === "ECONNABORTED") {
      return "A requisicao expirou. Tente novamente.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro desconhecido.";
}

export default apiClient;
