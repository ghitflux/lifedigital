import { create } from "zustand";
import type { Simulation } from "../services/api";

interface SimulationsState {
  simulations: Simulation[];
  current: Simulation | null;
  isLoading: boolean;
  error: string | null;
  setSimulations: (simulations: Simulation[]) => void;
  setCurrent: (simulation: Simulation) => void;
  addSimulation: (simulation: Simulation) => void;
  updateSimulation: (id: string, updates: Partial<Simulation>) => void;
  removeSimulation: (id: string) => void;
  clearCurrent: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
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
      simulations: state.simulations.map((sim) =>
        sim.id === id ? { ...sim, ...updates } : sim,
      ),
      current:
        state.current?.id === id
          ? { ...state.current, ...updates }
          : state.current,
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
}));
