import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const encryptionKey =
  process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY ?? "development-only-key";

const storage = new MMKV({ id: "auth-storage", encryptionKey });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  cpf?: string;
  whatsapp?: string;
  whatsappVerified?: boolean;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  login: (session: Session, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateSession: (session: Partial<Session>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      login: (session, user) =>
        set({
          user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken ?? null,
          expiresAt: session.expiresAt ?? null,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      updateSession: (session) =>
        set((state) => ({
          accessToken: session.accessToken ?? state.accessToken,
          refreshToken: session.refreshToken ?? state.refreshToken,
          expiresAt:
            session.expiresAt !== undefined
              ? (session.expiresAt ?? null)
              : state.expiresAt,
          isAuthenticated: Boolean(session.accessToken ?? state.accessToken),
        })),

      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: Boolean(token),
        }),

      setRefreshToken: (token) => set({ refreshToken: token }),

      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

useAuthStore.persist.onFinishHydration((state) => {
  useAuthStore.setState((current) => ({
    ...current,
    user: state?.user ?? null,
    accessToken: state?.accessToken ?? null,
    refreshToken: state?.refreshToken ?? null,
    expiresAt: state?.expiresAt ?? null,
    isAuthenticated: Boolean(state?.accessToken ?? state?.refreshToken),
    hasHydrated: true,
  }));
});
