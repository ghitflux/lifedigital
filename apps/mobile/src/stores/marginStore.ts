import { create } from "zustand";
import type { Margin, MarginHistory } from "../services/api";

interface MarginState {
  current: Margin | null;
  history: MarginHistory[];
  isLoading: boolean;
  error: string | null;
  setMargin: (margin: Margin) => void;
  setHistory: (history: MarginHistory[]) => void;
  updateMargin: (updates: Partial<Margin>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
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
}));
