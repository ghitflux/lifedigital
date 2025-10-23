/**
 * Simulations Store - Zustand
 *
 * Manages simulations data
 */

import { create } from 'zustand'

export interface SimulationResult {
  cet: number
  parcela: number
  total: number
  prazo: number
}

export interface Simulation {
  id: string
  produto: string
  status: 'pending' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aceita' | 'recusada'
  parametros: {
    valor?: number
    prazo?: number
    [key: string]: any
  }
  resultado?: SimulationResult
  criadoEm: string
  atualizadoEm: string
}

interface SimulationsState {
  simulations: Simulation[]
  current: Simulation | null
  isLoading: boolean
  error: string | null

  // Actions
  setSimulations: (simulations: Simulation[]) => void
  setCurrent: (simulation: Simulation) => void
  addSimulation: (simulation: Simulation) => void
  updateSimulation: (id: string, updates: Partial<Simulation>) => void
  removeSimulation: (id: string) => void
  clearCurrent: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  clearError: () => void
}

export const useSimulationsStore = create<SimulationsState>((set) => ({
  simulations: [],
  current: null,
  isLoading: false,
  error: null,

  setSimulations: (simulations) => set({ simulations, error: null }),

  setCurrent: (simulation) => set({ current: simulation, error: null }),

  addSimulation: (simulation) =>
    set((state) => ({
      simulations: [simulation, ...state.simulations],
      error: null,
    })),

  updateSimulation: (id, updates) =>
    set((state) => ({
      simulations: state.simulations.map((sim) => (sim.id === id ? { ...sim, ...updates } : sim)),
      current: state.current?.id === id ? { ...state.current, ...updates } : state.current,
      error: null,
    })),

  removeSimulation: (id) =>
    set((state) => ({
      simulations: state.simulations.filter((sim) => sim.id !== id),
      current: state.current?.id === id ? null : state.current,
      error: null,
    })),

  clearCurrent: () => set({ current: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
