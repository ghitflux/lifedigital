/**
 * Profile Store - Zustand
 *
 * Manages user profile data
 */

import { create } from 'zustand'

export interface ProfileData {
  cpf: string | null
  whatsapp: string | null
  whatsappVerified: boolean
  name: string | null
  email: string | null
  updatedAt: string | null
}

interface ProfileState {
  profile: ProfileData | null
  isLoading: boolean
  error: string | null

  // Actions
  setProfile: (profile: ProfileData) => void
  updateCPF: (cpf: string) => void
  updateWhatsApp: (whatsapp: string, verified: boolean) => void
  verifyWhatsApp: () => void
  clearProfile: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  clearError: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile, error: null }),

  updateCPF: (cpf) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, cpf } : null,
      error: null,
    })),

  updateWhatsApp: (whatsapp, verified) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, whatsapp, whatsappVerified: verified }
        : null,
      error: null,
    })),

  verifyWhatsApp: () =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, whatsappVerified: true } : null,
      error: null,
    })),

  clearProfile: () => set({ profile: null, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
