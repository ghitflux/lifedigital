/**
 * Auth Store - Zustand
 *
 * Manages authentication state
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

// MMKV Storage
const storage = new MMKV({ id: 'auth-storage', encryptionKey: 'life-digital-secret-key' })

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  cpf?: string
  whatsapp?: string
  whatsappVerified?: boolean
}

export interface Session {
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (session: Session, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  updateSession: (session: Session) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (session, user) =>
        set({
          session,
          user,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        }),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      updateSession: (session) => set({ session }),

      clearError: () => set({ error: null }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
