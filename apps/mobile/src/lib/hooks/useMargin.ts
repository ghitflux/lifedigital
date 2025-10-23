import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { queryKeys } from '../queryClient'
import { useAuthStore } from '../../stores/authStore'
import { useMarginStore } from '../../stores/marginStore'

/**
 * Base URL da API
 */
const API_URL = 'http://localhost:8080'

/**
 * Types
 */
interface Margin {
  total: number
  used: number
  available: number
  lastUpdated: string
}

interface MarginHistory {
  month: string
  year: number
  total: number
  used: number
  available: number
}

/**
 * Hook: useMargin
 *
 * @description
 * Query para buscar a margem consignável atual do usuário.
 * Retorna o total, utilizado e disponível.
 * Sincroniza automaticamente com o marginStore.
 *
 * @example
 * ```tsx
 * const { data: margin, isLoading, error, refetch } = useMargin()
 * if (margin) {
 *   console.log('Margem disponível:', margin.available)
 *   console.log('Margem total:', margin.total)
 *   console.log('Margem utilizada:', margin.used)
 * }
 * ```
 */
export function useMargin() {
  const { accessToken } = useAuthStore()
  const { setMargin } = useMarginStore()

  return useQuery({
    queryKey: queryKeys.margin,
    queryFn: async (): Promise<Margin> => {
      const response = await axios.get(`${API_URL}/margem`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken,
    onSuccess: (data) => {
      // Sincroniza com o marginStore
      setMargin(data)
    },
    // Refetch a cada 5 minutos para manter dados atualizados
    refetchInterval: 1000 * 60 * 5,
  })
}

/**
 * Hook: useMarginHistory
 *
 * @description
 * Query para buscar o histórico de margem consignável.
 * Retorna os valores dos últimos 12 meses.
 * Útil para exibir gráficos e tendências.
 *
 * @example
 * ```tsx
 * const { data: history, isLoading } = useMarginHistory()
 * history?.forEach(item => {
 *   console.log(`${item.month}/${item.year}: R$ ${item.available}`)
 * })
 * ```
 */
export function useMarginHistory() {
  const { accessToken } = useAuthStore()
  const { setHistory } = useMarginStore()

  return useQuery({
    queryKey: queryKeys.marginHistory,
    queryFn: async (): Promise<MarginHistory[]> => {
      const response = await axios.get(`${API_URL}/margem/historico`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken,
    onSuccess: (data) => {
      // Sincroniza com o marginStore
      setHistory(data)
    },
    // Histórico não muda com frequência, então pode ter staleTime maior
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

/**
 * Hook: useMarginPercentage
 *
 * @description
 * Hook customizado que calcula a porcentagem de utilização da margem.
 * Retorna um valor entre 0 e 100.
 *
 * @example
 * ```tsx
 * const { data: percentage } = useMarginPercentage()
 * if (percentage !== undefined) {
 *   console.log(`Margem utilizada: ${percentage}%`)
 * }
 * ```
 */
export function useMarginPercentage() {
  const { data: margin, ...rest } = useMargin()

  const percentage = margin ? (margin.used / margin.total) * 100 : 0

  return {
    data: percentage,
    margin,
    ...rest,
  }
}

/**
 * Hook: useMarginStatus
 *
 * @description
 * Hook customizado que retorna o status da margem.
 * Útil para exibir alertas e avisos ao usuário.
 *
 * Status:
 * - 'healthy': 0-50% utilizado (verde)
 * - 'warning': 50-80% utilizado (amarelo)
 * - 'critical': 80-100% utilizado (vermelho)
 * - 'unavailable': sem margem disponível (cinza)
 *
 * @example
 * ```tsx
 * const { status, color, message } = useMarginStatus()
 * console.log(`Status: ${status} - ${message}`)
 * ```
 */
export function useMarginStatus() {
  const { data: margin, isLoading, error } = useMargin()

  if (isLoading || error || !margin) {
    return {
      status: 'loading',
      color: 'gray',
      message: 'Carregando margem...',
    }
  }

  const percentage = (margin.used / margin.total) * 100

  if (margin.available === 0) {
    return {
      status: 'unavailable',
      color: 'gray',
      message: 'Nenhuma margem disponível',
      percentage,
    }
  }

  if (percentage < 50) {
    return {
      status: 'healthy',
      color: 'green',
      message: 'Margem saudável',
      percentage,
    }
  }

  if (percentage < 80) {
    return {
      status: 'warning',
      color: 'yellow',
      message: 'Atenção: margem limitada',
      percentage,
    }
  }

  return {
    status: 'critical',
    color: 'red',
    message: 'Alerta: margem quase esgotada',
    percentage,
  }
}
