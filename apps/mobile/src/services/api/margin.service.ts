import apiClient from './axios-client'

/**
 * Margin Service
 *
 * @description
 * Serviço responsável por operações relacionadas à margem consignável:
 * - Consultar margem disponível atual
 * - Obter histórico de margem (12 meses)
 */

/**
 * Types
 */
export interface Margin {
  total: number
  used: number
  available: number
  lastUpdated: string
}

export interface MarginHistory {
  month: string
  year: number
  total: number
  used: number
  available: number
}

/**
 * Consulta a margem consignável atual do usuário
 *
 * @description
 * Retorna:
 * - total: Margem total disponível para consignação
 * - used: Margem já comprometida com empréstimos ativos
 * - available: Margem disponível para novos empréstimos
 *
 * A margem é calculada com base em:
 * - Salário/aposentadoria do usuário
 * - Percentual máximo permitido por lei (30% ou 35%)
 * - Empréstimos consignados ativos
 *
 * @returns Margem atual do usuário
 *
 * @example
 * ```tsx
 * const margin = await marginService.getMargin()
 * console.log('Total:', margin.total)
 * console.log('Usado:', margin.used)
 * console.log('Disponível:', margin.available)
 *
 * const percentage = (margin.used / margin.total) * 100
 * console.log(`${percentage}% da margem utilizada`)
 * ```
 */
export async function getMargin(): Promise<Margin> {
  const response = await apiClient.get<Margin>('/margem')
  return response.data
}

/**
 * Obtém o histórico de margem dos últimos 12 meses
 *
 * @description
 * Retorna um array com os valores de margem mês a mês.
 * Útil para exibir gráficos de evolução da margem ao longo do tempo.
 *
 * @returns Array com histórico mensal de margem
 *
 * @example
 * ```tsx
 * const history = await marginService.getMarginHistory()
 *
 * // Exibir em gráfico
 * const chartData = history.map(item => ({
 *   x: `${item.month}/${item.year}`,
 *   y: item.available
 * }))
 *
 * // Encontrar tendência
 * const isIncreasing = history[0].available < history[history.length - 1].available
 * console.log(isIncreasing ? 'Margem crescendo' : 'Margem diminuindo')
 * ```
 */
export async function getMarginHistory(): Promise<MarginHistory[]> {
  const response = await apiClient.get<MarginHistory[]>('/margem/historico')
  return response.data
}

/**
 * Exportações nomeadas (namespace pattern)
 */
export const marginService = {
  getMargin,
  getMarginHistory,
}

export default marginService
