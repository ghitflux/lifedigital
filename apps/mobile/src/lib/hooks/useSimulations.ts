import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queryClient";
import { useAuthStore } from "../../stores/authStore";
import { useSimulationsStore } from "../../stores/simulationsStore";
import {
  approveSimulation as approveSimulationRequest,
  cancelSimulation as cancelSimulationRequest,
  createSimulation as createSimulationRequest,
  getSimulation as getSimulationRequest,
  getSimulations as getSimulationsRequest,
  ProductType,
  SimulationStatus,
} from "../../services/api";
import type { CreateSimulationRequest, Simulation } from "../../services/api";

interface SimulationMutationRequest {
  simulationId: string;
}

export { ProductType, SimulationStatus };

export function useSimulations() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSimulations = useSimulationsStore((state) => state.setSimulations);

  return useQuery({
    queryKey: queryKeys.simulations,
    queryFn: (): Promise<Simulation[]> => getSimulationsRequest(),
    enabled: Boolean(accessToken),
    onSuccess: (data) => setSimulations(data),
  });
}

export function useSimulation(id: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.simulation(id),
    queryFn: (): Promise<Simulation> => getSimulationRequest(id),
    enabled: Boolean(accessToken) && Boolean(id),
  });
}

export function useCreateSimulation() {
  const queryClient = useQueryClient();
  const addSimulation = useSimulationsStore((state) => state.addSimulation);

  return useMutation({
    mutationFn: (request: CreateSimulationRequest): Promise<Simulation> =>
      createSimulationRequest(request),
    onSuccess: (simulation) => {
      addSimulation(simulation);
      queryClient.setQueryData(queryKeys.simulation(simulation.id), simulation);
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations });
      queryClient.invalidateQueries({ queryKey: queryKeys.margin });
    },
    onError: (error) => {
      console.error("Failed to create simulation:", error);
    },
  });
}

export function useApproveSimulation() {
  const queryClient = useQueryClient();
  const updateSimulation = useSimulationsStore(
    (state) => state.updateSimulation,
  );

  return useMutation({
    mutationFn: ({
      simulationId,
    }: SimulationMutationRequest): Promise<Simulation> =>
      approveSimulationRequest(simulationId),
    onSuccess: (simulation) => {
      updateSimulation(simulation.id, simulation);
      queryClient.setQueryData(queryKeys.simulation(simulation.id), simulation);
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations });
      queryClient.invalidateQueries({ queryKey: queryKeys.margin });
    },
    onError: (error) => {
      console.error("Failed to approve simulation:", error);
    },
  });
}

export function useCancelSimulation() {
  const queryClient = useQueryClient();
  const updateSimulation = useSimulationsStore(
    (state) => state.updateSimulation,
  );

  return useMutation({
    mutationFn: ({
      simulationId,
    }: SimulationMutationRequest): Promise<Simulation> =>
      cancelSimulationRequest(simulationId),
    onSuccess: (simulation) => {
      updateSimulation(simulation.id, simulation);
      queryClient.setQueryData(queryKeys.simulation(simulation.id), simulation);
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations });
    },
    onError: (error) => {
      console.error("Failed to cancel simulation:", error);
    },
  });
}

export function usePendingSimulations() {
  const result = useSimulations();
  const pendingSimulations = result.data?.filter(
    (sim) => sim.status === SimulationStatus.PENDING,
  );

  return {
    ...result,
    data: pendingSimulations,
    count: pendingSimulations?.length ?? 0,
  };
}

export function useApprovedSimulations() {
  const result = useSimulations();
  const approvedSimulations = result.data?.filter((sim) =>
    [SimulationStatus.APPROVED, SimulationStatus.ACCEPTED].includes(sim.status),
  );

  return {
    ...result,
    data: approvedSimulations,
    count: approvedSimulations?.length ?? 0,
  };
}
