import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { queryKeys } from '../queryClient'
import { useAuthStore } from '../../stores/authStore'
import { useProfileStore } from '../../stores/profileStore'

/**
 * Base URL da API
 */
const API_URL = 'http://localhost:8080'

/**
 * Types
 */
interface Profile {
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

interface UpdateCPFRequest {
  cpf: string
}

interface UpdateWhatsAppRequest {
  whatsapp: string
}

interface VerifyOTPRequest {
  code: string
}

interface UpdateCPFResponse {
  success: boolean
  message: string
}

interface UpdateWhatsAppResponse {
  success: boolean
  message: string
  verificationId: string
}

interface VerifyOTPResponse {
  success: boolean
  message: string
  verified: boolean
}

/**
 * Hook: useProfile
 *
 * @description
 * Query para buscar dados do perfil do usuário autenticado.
 * Sincroniza automaticamente com o profileStore.
 *
 * @example
 * ```tsx
 * const { data: profile, isLoading, error } = useProfile()
 * if (profile) {
 *   console.log('CPF:', profile.cpf)
 * }
 * ```
 */
export function useProfile() {
  const { accessToken } = useAuthStore()
  const { setProfile } = useProfileStore()

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async (): Promise<Profile> => {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken,
    onSuccess: (data) => {
      // Sincroniza com o profileStore
      setProfile(data)
    },
  })
}

/**
 * Hook: useUpdateCPF
 *
 * @description
 * Mutation para atualizar o CPF do usuário.
 * Valida o CPF no backend e atualiza o perfil.
 *
 * @example
 * ```tsx
 * const updateCPF = useUpdateCPF()
 *
 * async function handleUpdateCPF(cpf: string) {
 *   await updateCPF.mutateAsync({ cpf })
 * }
 * ```
 */
export function useUpdateCPF() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (request: UpdateCPFRequest): Promise<UpdateCPFResponse> => {
      const response = await axios.put(
        `${API_URL}/me/cpf`,
        { cpf: request.cpf },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      // Invalida o cache do perfil para forçar reload
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    },
    onError: (error) => {
      console.error('Erro ao atualizar CPF:', error)
    },
  })
}

/**
 * Hook: useUpdateWhatsApp
 *
 * @description
 * Mutation para atualizar o WhatsApp do usuário.
 * Envia um código OTP via WhatsApp para verificação.
 *
 * @example
 * ```tsx
 * const updateWhatsApp = useUpdateWhatsApp()
 *
 * async function handleUpdateWhatsApp(phone: string) {
 *   const result = await updateWhatsApp.mutateAsync({ whatsapp: phone })
 *   console.log('Verification ID:', result.verificationId)
 * }
 * ```
 */
export function useUpdateWhatsApp() {
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (request: UpdateWhatsAppRequest): Promise<UpdateWhatsAppResponse> => {
      const response = await axios.put(
        `${API_URL}/me/whatsapp`,
        { whatsapp: request.whatsapp },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onError: (error) => {
      console.error('Erro ao atualizar WhatsApp:', error)
    },
  })
}

/**
 * Hook: useVerifyOTP
 *
 * @description
 * Mutation para verificar o código OTP enviado via WhatsApp.
 * Confirma a verificação do número de telefone.
 *
 * @example
 * ```tsx
 * const verifyOTP = useVerifyOTP()
 *
 * async function handleVerifyOTP(code: string) {
 *   const result = await verifyOTP.mutateAsync({ code })
 *   if (result.verified) {
 *     console.log('WhatsApp verificado com sucesso!')
 *   }
 * }
 * ```
 */
export function useVerifyOTP() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (request: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
      const response = await axios.post(
        `${API_URL}/me/whatsapp/verify`,
        { code: request.code },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      if (data.verified) {
        // Invalida o cache do perfil para forçar reload
        queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      }
    },
    onError: (error) => {
      console.error('Erro ao verificar OTP:', error)
    },
  })
}

/**
 * Hook: useUpdateProfile
 *
 * @description
 * Mutation genérica para atualizar dados do perfil.
 * Permite atualizar múltiplos campos ao mesmo tempo.
 *
 * @example
 * ```tsx
 * const updateProfile = useUpdateProfile()
 *
 * async function handleUpdateProfile() {
 *   await updateProfile.mutateAsync({
 *     name: 'Novo Nome',
 *     picture: 'https://...',
 *   })
 * }
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (request: Partial<Profile>): Promise<Profile> => {
      const response = await axios.patch(`${API_URL}/me`, request, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      // Atualiza o cache com os novos dados
      queryClient.setQueryData(queryKeys.profile, data)
    },
    onError: (error) => {
      console.error('Erro ao atualizar perfil:', error)
    },
  })
}
