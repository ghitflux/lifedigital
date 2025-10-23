import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { queryKeys } from '../queryClient'
import { useAuthStore } from '../../stores/authStore'
import { useDocumentsStore } from '../../stores/documentsStore'

/**
 * Base URL da API
 */
const API_URL = 'http://localhost:8080'

/**
 * Types
 */
export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DocumentType {
  RG = 'rg',
  CPF = 'cpf',
  PROOF_OF_ADDRESS = 'proof_of_address',
  PROOF_OF_INCOME = 'proof_of_income',
  PAYROLL = 'payroll',
  OTHER = 'other',
}

interface Document {
  id: string
  userId: string
  type: DocumentType
  fileName: string
  fileSize: number
  mimeType: string
  status: DocumentStatus
  uploadedAt: string
  reviewedAt?: string
  rejectionReason?: string
  url?: string
}

interface PresignedUrlRequest {
  fileName: string
  fileType: string
  fileSize: number
}

interface PresignedUrlResponse {
  uploadUrl: string
  objectKey: string
  expiresIn: number
}

interface FinalizeUploadRequest {
  objectKey: string
  type: DocumentType
}

interface UploadDocumentRequest {
  file: {
    uri: string
    name: string
    type: string
    size: number
  }
  type: DocumentType
  onProgress?: (progress: number) => void
}

/**
 * Hook: useDocuments
 *
 * @description
 * Query para buscar todos os documentos do usuário.
 * Sincroniza automaticamente com o documentsStore.
 *
 * @example
 * ```tsx
 * const { data: documents, isLoading, error } = useDocuments()
 * documents?.forEach(doc => {
 *   console.log(`${doc.fileName}: ${doc.status}`)
 * })
 * ```
 */
export function useDocuments() {
  const { accessToken } = useAuthStore()
  const { setDocuments } = useDocumentsStore()

  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: async (): Promise<Document[]> => {
      const response = await axios.get(`${API_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    },
    enabled: !!accessToken,
    onSuccess: (data) => {
      // Sincroniza com o documentsStore
      setDocuments(data)
    },
  })
}

/**
 * Hook: useDocument
 *
 * @description
 * Query para buscar um documento específico por ID.
 *
 * @example
 * ```tsx
 * const { data: document } = useDocument('doc-123')
 * if (document) {
 *   console.log('Status:', document.status)
 * }
 * ```
 */
export function useDocument(id: string) {
  const { accessToken } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: async (): Promise<Document> => {
      const response = await axios.get(`${API_URL}/documents/${id}`, {
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
 * Hook: useGetPresignedUrl
 *
 * @description
 * Mutation para obter uma URL pré-assinada do MinIO para upload.
 * A URL é temporária e expira após o tempo especificado.
 *
 * @example
 * ```tsx
 * const getPresignedUrl = useGetPresignedUrl()
 *
 * const result = await getPresignedUrl.mutateAsync({
 *   fileName: 'documento.pdf',
 *   fileType: 'application/pdf',
 *   fileSize: 1024000,
 * })
 * console.log('Upload URL:', result.uploadUrl)
 * ```
 */
export function useGetPresignedUrl() {
  const { accessToken } = useAuthStore()

  return useMutation({
    mutationFn: async (request: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
      const response = await axios.post(
        `${API_URL}/uploads/presign`,
        {
          file_name: request.fileName,
          content_type: request.fileType,
          file_size: request.fileSize,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    },
    onError: (error) => {
      console.error('Erro ao obter URL pré-assinada:', error)
    },
  })
}

/**
 * Hook: useUploadDocument
 *
 * @description
 * Mutation completa para upload de documento.
 * Realiza 3 etapas:
 * 1. Obtém URL pré-assinada do backend
 * 2. Faz upload do arquivo para o MinIO
 * 3. Finaliza o upload no backend (registra no banco)
 *
 * @example
 * ```tsx
 * const uploadDocument = useUploadDocument()
 *
 * const result = await uploadDocument.mutateAsync({
 *   file: {
 *     uri: 'file:///path/to/file.pdf',
 *     name: 'documento.pdf',
 *     type: 'application/pdf',
 *     size: 1024000,
 *   },
 *   type: DocumentType.RG,
 *   onProgress: (progress) => console.log(`Upload: ${progress}%`),
 * })
 * ```
 */
export function useUploadDocument() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()
  const { addDocument } = useDocumentsStore()

  return useMutation({
    mutationFn: async (request: UploadDocumentRequest): Promise<Document> => {
      const { file, type, onProgress } = request

      // Etapa 1: Obter URL pré-assinada
      const presignedResponse = await axios.post(
        `${API_URL}/uploads/presign`,
        {
          file_name: file.name,
          content_type: file.type,
          file_size: file.size,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const { uploadUrl, objectKey } = presignedResponse.data

      // Etapa 2: Upload do arquivo para o MinIO
      const fileBlob = await fetch(file.uri).then((r) => r.blob())

      await axios.put(uploadUrl, fileBlob, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      // Etapa 3: Finalizar upload no backend
      const finalizeResponse = await axios.post(
        `${API_URL}/uploads/finalize`,
        {
          object_key: objectKey,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      return finalizeResponse.data
    },
    onSuccess: (data) => {
      // Adiciona documento no store
      addDocument(data)

      // Invalida cache de documentos
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
    onError: (error) => {
      console.error('Erro ao fazer upload de documento:', error)
    },
  })
}

/**
 * Hook: useDeleteDocument
 *
 * @description
 * Mutation para deletar um documento.
 * Remove o arquivo do MinIO e o registro do banco.
 *
 * @example
 * ```tsx
 * const deleteDocument = useDeleteDocument()
 *
 * await deleteDocument.mutateAsync('doc-123')
 * ```
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient()
  const { accessToken } = useAuthStore()
  const { removeDocument } = useDocumentsStore()

  return useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      await axios.delete(`${API_URL}/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    },
    onSuccess: (_data, documentId) => {
      // Remove do store
      removeDocument(documentId)

      // Invalida cache de documentos
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
    onError: (error) => {
      console.error('Erro ao deletar documento:', error)
    },
  })
}
