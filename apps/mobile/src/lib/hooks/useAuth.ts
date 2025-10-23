import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { queryKeys } from '../queryClient'
import { useAuthStore } from '../../stores/authStore'

/**
 * Base URL da API
 */
const API_URL = 'http://localhost:8080'

/**
 * Types
 */
interface User {
  id: string
  email: string
  name: string
  picture?: string
  cpf?: string
  whatsapp?: string
  whatsappVerified: boolean
  createdAt: string
  updatedAt: string
}

interface LoginWithGoogleRequest {
  idToken: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

/**
 * Hook: useUser
 *
 * @description
 * Query para buscar dados do usuário autenticado.
 * Só faz a requisição se houver um token de acesso.
 *
 * @example
 * ```tsx
 * const { data: user, isLoading, error } = useUser()
 * if (user) {
 *   console.log('Usuário:', user.name)
 * }
 * ```
 */
export function useUser() {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async (): Promise<User> => {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken, // Só executa se houver token
  })
}

/**
 * Hook: useLoginWithGoogle
 *
 * @description
 * Mutation para fazer login com Google OAuth.
 * Recebe o ID token do Google e autentica no backend.
 * Ao sucesso, salva tokens e dados do usuário no authStore.
 *
 * @example
 * ```tsx
 * const loginWithGoogle = useLoginWithGoogle()
 *
 * async function handleGoogleLogin() {
 *   const idToken = await getGoogleIdToken() // via expo-auth-session
 *   await loginWithGoogle.mutateAsync({ idToken })
 * }
 * ```
 */
export function useLoginWithGoogle() {
  const queryClient = useQueryClient()
  const { setAccessToken, setRefreshToken, setIsAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: async (request: LoginWithGoogleRequest): Promise<LoginResponse> => {
      const response = await axios.post(`${API_URL}/auth/google`, {
        id_token: request.idToken,
      })
      return response.data
    },
    onSuccess: (data) => {
      // Salva tokens no store (que persiste no MMKV)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setIsAuthenticated(true)

      // Adiciona usuário no cache do TanStack Query
      queryClient.setQueryData(queryKeys.user, data.user)
    },
    onError: (error) => {
      console.error('Erro ao fazer login com Google:', error)
      setIsAuthenticated(false)
    },
  })
}

/**
 * Hook: useRefreshToken
 *
 * @description
 * Mutation para renovar o access token usando o refresh token.
 * Usado quando o access token expira (401 Unauthorized).
 *
 * @example
 * ```tsx
 * const refreshToken = useRefreshToken()
 *
 * async function handleTokenExpired() {
 *   await refreshToken.mutateAsync()
 * }
 * ```
 */
export function useRefreshToken() {
  const { refreshToken, setAccessToken, setIsAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: async (): Promise<{ accessToken: string }> => {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      })
      return response.data
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setIsAuthenticated(true)
    },
    onError: (error) => {
      console.error('Erro ao renovar token:', error)
      // Se falhar ao renovar, desloga o usuário
      setIsAuthenticated(false)
      setAccessToken(null)
    },
  })
}

/**
 * Hook: useLogout
 *
 * @description
 * Mutation para fazer logout do usuário.
 * Limpa tokens, cache e reseta estado de autenticação.
 *
 * @example
 * ```tsx
 * const logout = useLogout()
 *
 * async function handleLogout() {
 *   await logout.mutateAsync()
 * }
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient()
  const { accessToken, logout: logoutStore } = useAuthStore()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      // Chama endpoint de logout no backend (opcional)
      if (accessToken) {
        try {
          await axios.post(
            `${API_URL}/auth/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        } catch (error) {
          // Ignora erros (pode ser que o token já esteja inválido)
          console.warn('Erro ao fazer logout no backend:', error)
        }
      }
    },
    onSuccess: () => {
      // Limpa store local
      logoutStore()

      // Limpa todo o cache do TanStack Query
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, limpa localmente
      logoutStore()
      queryClient.clear()
    },
  })
}
