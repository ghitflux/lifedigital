import apiClient from './axios-client'

/**
 * Auth Service
 *
 * @description
 * Serviço responsável por operações de autenticação:
 * - Login com Google OAuth
 * - Renovação de token
 * - Logout
 * - Obter dados do usuário autenticado
 */

/**
 * Types
 */
export interface User {
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

export interface LoginWithGoogleRequest {
  idToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

/**
 * Autentica usuário com Google OAuth
 *
 * @param idToken - ID token retornado pelo Google após autenticação
 * @returns Token de acesso, refresh token e dados do usuário
 *
 * @example
 * ```tsx
 * const { accessToken, user } = await authService.loginWithGoogle({
 *   idToken: 'google-id-token-here'
 * })
 * ```
 */
export async function loginWithGoogle(request: LoginWithGoogleRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/google', {
    id_token: request.idToken,
  })

  return response.data
}

/**
 * Renova o access token usando o refresh token
 *
 * @param refreshToken - Refresh token válido
 * @returns Novo access token
 *
 * @example
 * ```tsx
 * const { accessToken } = await authService.refreshToken({
 *   refreshToken: 'refresh-token-here'
 * })
 * ```
 */
export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refresh_token: request.refreshToken,
  })

  return response.data
}

/**
 * Faz logout do usuário
 *
 * @description
 * Invalida o access token no backend.
 * O cliente também deve limpar os tokens armazenados localmente.
 *
 * @example
 * ```tsx
 * await authService.logout()
 * ```
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

/**
 * Obtém dados do usuário autenticado
 *
 * @returns Dados completos do usuário logado
 *
 * @example
 * ```tsx
 * const user = await authService.getMe()
 * console.log('Usuário:', user.name)
 * ```
 */
export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/me')
  return response.data
}

/**
 * Exportações nomeadas (namespace pattern)
 */
export const authService = {
  loginWithGoogle,
  refreshToken,
  logout,
  getMe,
}

export default authService
