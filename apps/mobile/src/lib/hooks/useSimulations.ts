import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { queryKeys } from '../queryClient'
import { useAuthStore } from '../../stores/authStore'
import { useSimulationsStore } from '../../stores/simulationsStore'

/**
 * Base URL da API
 */
const API_URL = 'http://localhost:8080'

/**
 * Types
 */
export enum SimulationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
}

export enum ProductType {
  CONSIGNADO = 'consignado',
  CARTAO_CONSIGNADO = 'cartao_consignado',
  REFIN = 'refin',
  PORTABILIDADE = 'portabilidade',
}

interface Simulation {
  id: string
  userId: string
  productType: ProductType
  requestedAmount: number
  approvedAmount?: number
  installments: number
  interestRate?: number
  cet?: number
  monthlyPayment?: number
  totalAmount?: number
  status: SimulationStatus
  createdAt: string
  updatedAt: string
  expiresAt?: string
  rejectionReason?: string
}

interface CreateSimulationRequest {
  productType: ProductType
  requestedAmount: number
  installments: number
}

interface ApproveSimulationRequest {
  simulationId: string
}

/**
 * Hook: useSimulations
 *
 * @description
 * Query para buscar todas as simulações do usuário.
 * Retorna um array ordenado por data (mais recentes primeiro).
 * Sincroniza automaticamente com o simulationsStore.
 *
 * @example
 * ```tsx
 * const { data: simulations, isLoading, error } = useSimulations()
 * simulations?.forEach(sim => {
 *   console.log(`${sim.productType}: R$ ${sim.requestedAmount}`)
 * })
 * ```
 */
export function useSimulations() {
  const { accessToken } = useAuthStore()
  const { setSimulations } = useSimulationsStore()

  return useQuery({
    queryKey: queryKeys.simulations,
    queryFn: async (): Promise<Simulation[]> => {
      const response = await axios.get(`${API_URL}/simulacoes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken,
    onSuccess: (data) => {
      // Sincroniza com o simulationsStore
      setSimulations(data)
    },
  })
}

/**
 * Hook: useSimulation
 *
 * @description
 * Query para buscar uma simulação específica por ID.
 * Retorna todos os detalhes da simulação.
 *
 * @example
 * ```tsx
 * const { data: simulation } = useSimulation('sim-123')
 * if (simulation) {
 *   console.log('Status:', simulation.status)
 *   console.log('CET:', simulation.cet)
 * }
 * ```
 */
export function useSimulation(id: string) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.simulation(id),
    queryFn: async (): Promise<Simulation> => {
      const response = await axios.get(`${API_URL}/simulacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken && !!id,
  })
}

/**
 * Hook: useCreateSimulation
 *
 * @description
 * Mutation para criar uma nova simulação de crédito.
 * Envia os dados da simulação e retorna o resultado processado pelo backend.
 *
 * @example
 * ```tsx
 * const createSimulation = useCreateSimulation()
 *
 * const result = await createSimulation.mutateAsync({
 *   productType: ProductType.CONSIGNADO,
 *   requestedAmount: 10000,
 *   installments: 24,
 * })
 *
 * console.log('Simulação criada:', result.id)
 * console.log('Parcela:', result.monthlyPayment)
 * ```
 */
export function useCreateSimulation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()
  const { addSimulation } = useSimulationsStore()

  return useMutation({
    mutationFn: async (request: CreateSimulationRequest): Promise<Simulation> => {
      const response = await axios.post(
        `${API_URL}/simulacoes`,
        {
          product_type: request.productType,
          requested_amount: request.requestedAmount,
          installments: request.installments,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      // Adiciona simulação no store
      addSimulation(data)

      // Invalida cache de simulações para forçar reload
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations })

      // Também invalida margem (pode ter sido atualizada)
      queryClient.invalidateQueries({ queryKey: queryKeys.margin })
    },
    onError: (error) => {
      console.error('Erro ao criar simulação:', error)
    },
  })
}

/**
 * Hook: useApproveSimulation
 *
 * @description
 * Mutation para aceitar/aprovar uma simulação de crédito.
 * Confirma que o usuário aceita os termos da simulação.
 * Após aprovação, a simulação entra em processamento.
 *
 * @example
 * ```tsx
 * const approveSimulation = useApproveSimulation()
 *
 * await approveSimulation.mutateAsync({ simulationId: 'sim-123' })
 * ```
 */
export function useApproveSimulation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()
  const { updateSimulation } = useSimulationsStore()

  return useMutation({
    mutationFn: async (request: ApproveSimulationRequest): Promise<Simulation> => {
      const response = await axios.post(
        `${API_URL}/simulacoes/${request.simulationId}/aceite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza simulação no store
      updateSimulation(data.id, data)

      // Atualiza cache específico da simulação
      queryClient.setQueryData(queryKeys.simulation(data.id), data)

      // Invalida lista de simulações
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations })

      // Invalida margem (foi atualizada)
      queryClient.invalidateQueries({ queryKey: queryKeys.margin })
    },
    onError: (error) => {
      console.error('Erro ao aprovar simulação:', error)
    },
  })
}

/**
 * Hook: useCancelSimulation
 *
 * @description
 * Mutation para cancelar uma simulação de crédito.
 * Permite que o usuário cancele uma simulação antes de ser processada.
 *
 * @example
 * ```tsx
 * const cancelSimulation = useCancelSimulation()
 *
 * await cancelSimulation.mutateAsync({ simulationId: 'sim-123' })
 * ```
 */
export function useCancelSimulation() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()
  const { updateSimulation } = useSimulationsStore()

  return useMutation({
    mutationFn: async (request: ApproveSimulationRequest): Promise<Simulation> => {
      const response = await axios.post(
        `${API_URL}/simulacoes/${request.simulationId}/cancelar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza simulação no store
      updateSimulation(data.id, data)

      // Atualiza cache específico da simulação
      queryClient.setQueryData(queryKeys.simulation(data.id), data)

      // Invalida lista de simulações
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations })
    },
    onError: (error) => {
      console.error('Erro ao cancelar simulação:', error)
    },
  })
}

/**
 * Hook: usePendingSimulations
 *
 * @description
 * Hook customizado que retorna apenas as simulações pendentes.
 * Útil para exibir na dashboard simulações aguardando resposta.
 *
 * @example
 * ```tsx
 * const { data: pendingSimulations, count } = usePendingSimulations()
 * console.log(`${count} simulações pendentes`)
 * ```
 */
export function usePendingSimulations() {
  const { data: simulations, ...rest } = useSimulations()

  const pendingSimulations = simulations?.filter((sim) => sim.status === SimulationStatus.PENDING)

  return {
    data: pendingSimulations,
    count: pendingSimulations?.length ?? 0,
    ...rest,
  }
}

/**
 * Hook: useApprovedSimulations
 *
 * @description
 * Hook customizado que retorna apenas as simulações aprovadas.
 * Útil para exibir histórico de simulações bem-sucedidas.
 *
 * @example
 * ```tsx
 * const { data: approvedSimulations, count } = useApprovedSimulations()
 * console.log(`${count} simulações aprovadas`)
 * ```
 */
export function useApprovedSimulations() {
  const { data: simulations, ...rest } = useSimulations()

  const approvedSimulations = simulations?.filter(
    (sim) => sim.status === SimulationStatus.APPROVED || sim.status === SimulationStatus.ACCEPTED
  )

  return {
    data: approvedSimulations,
    count: approvedSimulations?.length ?? 0,
    ...rest,
  }
}
