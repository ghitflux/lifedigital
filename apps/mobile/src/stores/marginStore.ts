/**
 * Margin Store - Zustand
 *
 * Manages margin data and history
 */

import { create } from 'zustand'

export interface MarginData {
  totalDisponivel: number
  bruto: number
  utilizado: number
  atualizadoEm: string
}

export interface MarginHistoryItem {
  mes: string
  valor: number
}

interface MarginState {
  current: MarginData | null
  history: MarginHistoryItem[]
  isLoading: boolean
  error: string | null

  // Actions
  setMargin: (margin: MarginData) => void
  setHistory: (history: MarginHistoryItem[]) => void
  updateMargin: (updates: Partial<MarginData>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  clearError: () => void
}

export const useMarginStore = create<MarginState>((set) => ({
  current: null,
  history: [],
  isLoading: false,
  error: null,

  setMargin: (margin) => set({ current: margin, error: null }),

  setHistory: (history) => set({ history, error: null }),

  updateMargin: (updates) =>
    set((state) => ({
      current: state.current ? { ...state.current, ...updates } : null,
      error: null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
