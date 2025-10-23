import apiClient from './axios-client'
import { User } from './auth.service'

/**
 * Profile Service
 *
 * @description
 * Serviço responsável por operações relacionadas ao perfil do usuário:
 * - Obter perfil completo
 * - Atualizar dados pessoais (nome, foto, etc.)
 * - Atualizar CPF
 * - Iniciar verificação de WhatsApp
 * - Verificar código OTP do WhatsApp
 */

/**
 * Types
 */
export interface UpdateProfileRequest {
  name?: string
  picture?: string
}

export interface UpdateCPFRequest {
  cpf: string
}

export interface UpdateCPFResponse {
  success: boolean
  message: string
}

export interface UpdateWhatsAppRequest {
  whatsapp: string
}

export interface UpdateWhatsAppResponse {
  success: boolean
  message: string
  verificationId: string
}

export interface VerifyOTPRequest {
  code: string
}

export interface VerifyOTPResponse {
  success: boolean
  message: string
  verified: boolean
}

/**
 * Obtém perfil completo do usuário autenticado
 *
 * @returns Dados completos do perfil
 *
 * @example
 * ```tsx
 * const profile = await profileService.getProfile()
 * console.log('CPF:', profile.cpf)
 * ```
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/me')
  return response.data
}

/**
 * Atualiza dados do perfil
 *
 * @param data - Campos a serem atualizados (nome, foto, etc.)
 * @returns Perfil atualizado
 *
 * @example
 * ```tsx
 * const updatedProfile = await profileService.updateProfile({
 *   name: 'João Silva',
 *   picture: 'https://...'
 * })
 * ```
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.patch<User>('/me', data)
  return response.data
}

/**
 * Atualiza o CPF do usuário
 *
 * @param cpf - CPF formatado (123.456.789-00) ou apenas números
 * @returns Resposta indicando sucesso ou erro
 *
 * @example
 * ```tsx
 * const result = await profileService.updateCPF({
 *   cpf: '123.456.789-00'
 * })
 * if (result.success) {
 *   console.log('CPF atualizado com sucesso!')
 * }
 * ```
 */
export async function updateCPF(request: UpdateCPFRequest): Promise<UpdateCPFResponse> {
  const response = await apiClient.put<UpdateCPFResponse>('/me/cpf', {
    cpf: request.cpf,
  })
  return response.data
}

/**
 * Inicia o processo de verificação do WhatsApp
 *
 * @description
 * Envia um código OTP via WhatsApp para o número fornecido.
 * O usuário deve inserir este código para confirmar a verificação.
 *
 * @param whatsapp - Número de telefone com código do país (+5511999999999)
 * @returns ID da verificação e mensagem de confirmação
 *
 * @example
 * ```tsx
 * const result = await profileService.updateWhatsApp({
 *   whatsapp: '+5511999999999'
 * })
 * console.log('Código enviado! Verification ID:', result.verificationId)
 * ```
 */
export async function updateWhatsApp(request: UpdateWhatsAppRequest): Promise<UpdateWhatsAppResponse> {
  const response = await apiClient.put<UpdateWhatsAppResponse>('/me/whatsapp', {
    whatsapp: request.whatsapp,
  })
  return response.data
}

/**
 * Verifica o código OTP enviado via WhatsApp
 *
 * @description
 * Confirma o código de verificação recebido no WhatsApp.
 * Se válido, marca o WhatsApp como verificado no perfil.
 *
 * @param code - Código de 6 dígitos recebido via WhatsApp
 * @returns Resultado da verificação
 *
 * @example
 * ```tsx
 * const result = await profileService.verifyOTP({
 *   code: '123456'
 * })
 * if (result.verified) {
 *   console.log('WhatsApp verificado com sucesso!')
 * }
 * ```
 */
export async function verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  const response = await apiClient.post<VerifyOTPResponse>('/me/whatsapp/verify', {
    code: request.code,
  })
  return response.data
}

/**
 * Exportações nomeadas (namespace pattern)
 */
export const profileService = {
  getProfile,
  updateProfile,
  updateCPF,
  updateWhatsApp,
  verifyOTP,
}

export default profileService
