import { QueryClient } from '@tanstack/react-query'

/**
 * Configuração global do TanStack Query (React Query)
 *
 * @description
 * Define opções padrão para todas as queries e mutations do app:
 * - staleTime: 5 minutos - tempo que dados são considerados "frescos"
 * - gcTime: 1 hora - tempo que dados ficam em cache antes de serem coletados
 * - retry: 3 tentativas - número de retentativas automáticas em caso de erro
 * - refetchOnWindowFocus: false - não recarrega ao voltar para o app
 *
 * @example
 * ```tsx
 * import { QueryClientProvider } from '@tanstack/react-query'
 * import { queryClient } from './lib/queryClient'
 *
 * <QueryClientProvider client={queryClient}>
 *   <App />
 * </QueryClientProvider>
 * ```
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados são considerados "frescos" (5 minutos)
      staleTime: 1000 * 60 * 5,

      // Tempo que os dados ficam em cache (1 hora)
      gcTime: 1000 * 60 * 60,

      // Número de tentativas automáticas em caso de erro
      retry: 3,

      // Função de retry com backoff exponencial
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Não recarrega ao voltar para o app (React Native não tem "window focus")
      refetchOnWindowFocus: false,

      // Não recarrega ao reconectar (evita múltiplas requisições)
      refetchOnReconnect: false,

      // Não recarrega ao montar componente se dados estão frescos
      refetchOnMount: false,
    },
    mutations: {
      // Número de tentativas para mutations (apenas 1 por segurança)
      retry: 1,

      // Função de retry com delay de 1 segundo
      retryDelay: 1000,
    },
  },
})

/**
 * Query Keys
 *
 * @description
 * Constantes para as chaves de cache do TanStack Query.
 * Usar constantes evita erros de digitação e facilita refatoração.
 */
export const queryKeys = {
  // Auth
  user: ['user'] as const,

  // Profile
  profile: ['profile'] as const,

  // Documents
  documents: ['documents'] as const,
  document: (id: string) => ['documents', id] as const,

  // Margin
  margin: ['margin'] as const,
  marginHistory: ['margin', 'history'] as const,

  // Simulations
  simulations: ['simulations'] as const,
  simulation: (id: string) => ['simulations', id] as const,

  // Notifications
  notifications: ['notifications'] as const,
} as const
