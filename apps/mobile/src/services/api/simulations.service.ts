import apiClient from './axios-client'

/**
 * Simulations Service
 *
 * @description
 * Serviço responsável por operações com simulações de crédito:
 * - Listar simulações do usuário
 * - Obter detalhes de uma simulação
 * - Criar nova simulação
 * - Aceitar/aprovar simulação
 * - Cancelar simulação
 */

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

export interface Simulation {
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

export interface CreateSimulationRequest {
  productType: ProductType
  requestedAmount: number
  installments: number
}

/**
 * Lista todas as simulações do usuário
 *
 * @returns Array de simulações ordenado por data (mais recentes primeiro)
 *
 * @example
 * ```tsx
 * const simulations = await simulationsService.getSimulations()
 * simulations.forEach(sim => {
 *   console.log(`${sim.productType}: R$ ${sim.requestedAmount} - ${sim.status}`)
 * })
 * ```
 */
export async function getSimulations(): Promise<Simulation[]> {
  const response = await apiClient.get<Simulation[]>('/simulacoes')
  return response.data
}

/**
 * Obtém detalhes de uma simulação específica
 *
 * @param simulationId - ID da simulação
 * @returns Simulação completa com todos os detalhes
 *
 * @example
 * ```tsx
 * const simulation = await simulationsService.getSimulation('sim-123')
 * console.log('CET:', simulation.cet)
 * console.log('Parcela:', simulation.monthlyPayment)
 * console.log('Total:', simulation.totalAmount)
 * ```
 */
export async function getSimulation(simulationId: string): Promise<Simulation> {
  const response = await apiClient.get<Simulation>(`/simulacoes/${simulationId}`)
  return response.data
}

/**
 * Cria uma nova simulação de crédito
 *
 * @description
 * Envia os dados da simulação para o backend que:
 * 1. Valida se o usuário tem margem disponível
 * 2. Consulta as tabelas de taxas de juros
 * 3. Calcula o CET, parcela e valor total
 * 4. Retorna a simulação aprovada ou rejeitada
 *
 * @param productType - Tipo de produto (consignado, cartão, refinanciamento, portabilidade)
 * @param requestedAmount - Valor solicitado em reais
 * @param installments - Número de parcelas (6, 12, 24, 36, 48, 60, 72, 84, 96)
 * @returns Simulação criada
 *
 * @example
 * ```tsx
 * const simulation = await simulationsService.createSimulation({
 *   productType: ProductType.CONSIGNADO,
 *   requestedAmount: 10000,
 *   installments: 24
 * })
 *
 * if (simulation.status === SimulationStatus.APPROVED) {
 *   console.log('Aprovado!')
 *   console.log('Parcela:', simulation.monthlyPayment)
 *   console.log('CET:', simulation.cet)
 * } else {
 *   console.log('Rejeitado:', simulation.rejectionReason)
 * }
 * ```
 */
export async function createSimulation(request: CreateSimulationRequest): Promise<Simulation> {
  const response = await apiClient.post<Simulation>('/simulacoes', {
    product_type: request.productType,
    requested_amount: request.requestedAmount,
    installments: request.installments,
  })
  return response.data
}

/**
 * Aceita/aprova uma simulação
 *
 * @description
 * Confirma que o usuário aceita os termos da simulação.
 * Após o aceite:
 * 1. A margem é reservada
 * 2. O processo de contratação é iniciado
 * 3. O usuário pode acompanhar o status na dashboard
 *
 * Importante: Uma simulação aprovada tem prazo de validade (geralmente 7 dias).
 *
 * @param simulationId - ID da simulação a ser aceita
 * @returns Simulação atualizada com status ACCEPTED
 *
 * @example
 * ```tsx
 * const simulation = await simulationsService.approveSimulation('sim-123')
 * if (simulation.status === SimulationStatus.ACCEPTED) {
 *   console.log('Simulação aceita! Processo de contratação iniciado.')
 * }
 * ```
 */
export async function approveSimulation(simulationId: string): Promise<Simulation> {
  const response = await apiClient.post<Simulation>(`/simulacoes/${simulationId}/aceite`)
  return response.data
}

/**
 * Cancela uma simulação
 *
 * @description
 * Permite que o usuário cancele uma simulação antes de ser processada.
 * A margem reservada é liberada.
 *
 * @param simulationId - ID da simulação a ser cancelada
 * @returns Simulação atualizada com status CANCELLED
 *
 * @example
 * ```tsx
 * const simulation = await simulationsService.cancelSimulation('sim-123')
 * if (simulation.status === SimulationStatus.CANCELLED) {
 *   console.log('Simulação cancelada com sucesso.')
 * }
 * ```
 */
export async function cancelSimulation(simulationId: string): Promise<Simulation> {
  const response = await apiClient.post<Simulation>(`/simulacoes/${simulationId}/cancelar`)
  return response.data
}

/**
 * Exportações nomeadas (namespace pattern)
 */
export const simulationsService = {
  getSimulations,
  getSimulation,
  createSimulation,
  approveSimulation,
  cancelSimulation,
}

export default simulationsService
