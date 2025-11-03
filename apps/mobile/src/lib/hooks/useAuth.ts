import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { useAuthStore } from "../../stores/authStore";
import {
  getMe,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
  refreshToken as refreshTokenRequest,
} from "../../services/api";
import type {
  LoginResponse,
  LoginWithGoogleRequest,
  RefreshTokenResponse,
  User,
} from "../../services/api";

export function useUser() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.user,
    queryFn: (): Promise<User> => getMe(),
    enabled: Boolean(accessToken),
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  return useMutation({
    mutationFn: (request: LoginWithGoogleRequest): Promise<LoginResponse> =>
      loginWithGoogleRequest(request),
    onSuccess: (data) => {
      login(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data.user,
      );

      queryClient.setQueryData(queryKeys.user, data.user);
    },
    onError: (error) => {
      console.error("Failed to login with Google:", error);
      setIsAuthenticated(false);
    },
  });
}

export function useRefreshToken() {
  const storedRefreshToken = useAuthStore((state) => state.refreshToken);
  const updateSession = useAuthStore((state) => state.updateSession);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async (): Promise<RefreshTokenResponse> => {
      if (!storedRefreshToken) {
        throw new Error("Missing refresh token");
      }

      return refreshTokenRequest({ refreshToken: storedRefreshToken });
    },
    onSuccess: (data) => {
      updateSession({ accessToken: data.accessToken });
      setIsAuthenticated(true);
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error);
      logout();
      setIsAuthenticated(false);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async (): Promise<void> => {
      if (!accessToken) {
        return;
      }

      try {
        await logoutRequest();
      } catch (error) {
        console.warn("Failed to call logout endpoint:", error);
      }
    },
    onSettled: () => {
      logoutStore();
      queryClient.clear();
    },
  });
}
