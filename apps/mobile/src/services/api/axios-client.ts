import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../../stores/authStore'

/**
 * Base URL da API
 *
 * Em produção, deve ser substituída pela URL real do backend.
 * Pode ser configurada via variáveis de ambiente.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

/**
 * Cliente Axios configurado
 *
 * @description
 * Instância do Axios com configurações customizadas:
 * - Base URL apontando para o backend
 * - Timeout de 30 segundos
 * - Headers padrão (Content-Type, Accept)
 * - Interceptors para autenticação e tratamento de erros
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Request Interceptor
 *
 * @description
 * Intercepta todas as requisições para adicionar o token de autenticação.
 * Se houver um accessToken no authStore, adiciona no header Authorization.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()

    // Adiciona token se disponível
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Log da requisição (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('📤 API Request:', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 *
 * @description
 * Intercepta todas as respostas para:
 * 1. Fazer log de respostas bem-sucedidas (dev)
 * 2. Tratar erros HTTP (401, 403, 500, etc.)
 * 3. Tentar renovar token automaticamente em caso de 401
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log da resposta (apenas em desenvolvimento)
    if (__DEV__) {
      console.log('📥 API Response:', response.config.method?.toUpperCase(), response.config.url, response.status)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log de erro
    if (__DEV__) {
      console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status)
    }

    // 401 Unauthorized - Token expirado ou inválido
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, setAccessToken, setIsAuthenticated } = useAuthStore.getState()

        // Se não houver refresh token, desloga
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Tenta renovar o token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { accessToken: newAccessToken } = response.data

        // Atualiza o token no store
        setAccessToken(newAccessToken)
        setIsAuthenticated(true)

        // Atualiza o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Retenta a requisição original com o novo token
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Se falhar ao renovar, desloga o usuário
        const { logout } = useAuthStore.getState()
        logout()

        return Promise.reject(refreshError)
      }
    }

    // 403 Forbidden - Sem permissão
    if (error.response?.status === 403) {
      console.error('🚫 Acesso negado. Você não tem permissão para acessar este recurso.')
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.error('🔍 Recurso não encontrado.')
    }

    // 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('💥 Erro interno do servidor. Tente novamente mais tarde.')
    }

    // 503 Service Unavailable
    if (error.response?.status === 503) {
      console.error('⚠️ Serviço temporariamente indisponível. Tente novamente em alguns instantes.')
    }

    // Network Error (sem conexão)
    if (error.message === 'Network Error') {
      console.error('📡 Erro de rede. Verifique sua conexão com a internet.')
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ A requisição demorou muito e foi cancelada. Tente novamente.')
    }

    return Promise.reject(error)
  }
)

/**
 * Helper: Extrai mensagem de erro da resposta da API
 *
 * @description
 * Tenta extrair uma mensagem de erro legível da resposta da API.
 * Suporta diferentes formatos de resposta de erro.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Erro HTTP com resposta do servidor
    if (error.response?.data) {
      const data = error.response.data as any

      // Formato: { message: "..." }
      if (data.message) {
        return data.message
      }

      // Formato: { detail: "..." } (FastAPI)
      if (data.detail) {
        return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
      }

      // Formato: { error: "..." }
      if (data.error) {
        return data.error
      }
    }

    // Erro de rede
    if (error.message === 'Network Error') {
      return 'Erro de rede. Verifique sua conexão com a internet.'
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou muito e foi cancelada. Tente novamente.'
    }

    // Mensagem genérica do Axios
    return error.message
  }

  // Erro desconhecido
  if (error instanceof Error) {
    return error.message
  }

  return 'Ocorreu um erro desconhecido.'
}

export default apiClient
