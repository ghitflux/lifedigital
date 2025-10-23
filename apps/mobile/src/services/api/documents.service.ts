import apiClient from './axios-client'

/**
 * Documents Service
 *
 * @description
 * Serviço responsável por operações com documentos:
 * - Listar documentos do usuário
 * - Obter detalhes de um documento
 * - Obter URL pré-assinada para upload
 * - Finalizar upload de documento
 * - Deletar documento
 */

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

export interface Document {
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

export interface GetPresignedUrlRequest {
  fileName: string
  contentType: string
  fileSize: number
}

export interface GetPresignedUrlResponse {
  uploadUrl: string
  objectKey: string
  expiresIn: number
}

export interface FinalizeUploadRequest {
  objectKey: string
  type: DocumentType
}

/**
 * Lista todos os documentos do usuário
 *
 * @returns Array de documentos
 *
 * @example
 * ```tsx
 * const documents = await documentsService.getDocuments()
 * documents.forEach(doc => {
 *   console.log(`${doc.fileName}: ${doc.status}`)
 * })
 * ```
 */
export async function getDocuments(): Promise<Document[]> {
  const response = await apiClient.get<Document[]>('/documents')
  return response.data
}

/**
 * Obtém detalhes de um documento específico
 *
 * @param documentId - ID do documento
 * @returns Documento completo
 *
 * @example
 * ```tsx
 * const document = await documentsService.getDocument('doc-123')
 * console.log('Status:', document.status)
 * ```
 */
export async function getDocument(documentId: string): Promise<Document> {
  const response = await apiClient.get<Document>(`/documents/${documentId}`)
  return response.data
}

/**
 * Obtém URL pré-assinada do MinIO para upload direto
 *
 * @description
 * Esta é a primeira etapa do upload de documentos.
 * A URL retornada pode ser usada para fazer upload direto ao MinIO (S3-compatible).
 *
 * @param fileName - Nome do arquivo
 * @param contentType - MIME type (ex: application/pdf, image/jpeg)
 * @param fileSize - Tamanho do arquivo em bytes
 * @returns URL pré-assinada, object key e tempo de expiração
 *
 * @example
 * ```tsx
 * const result = await documentsService.getPresignedUrl({
 *   fileName: 'documento.pdf',
 *   contentType: 'application/pdf',
 *   fileSize: 1024000
 * })
 *
 * // Usar result.uploadUrl para upload direto
 * await fetch(result.uploadUrl, {
 *   method: 'PUT',
 *   body: fileBlob,
 *   headers: { 'Content-Type': 'application/pdf' }
 * })
 * ```
 */
export async function getPresignedUrl(request: GetPresignedUrlRequest): Promise<GetPresignedUrlResponse> {
  const response = await apiClient.post<GetPresignedUrlResponse>('/uploads/presign', {
    file_name: request.fileName,
    content_type: request.contentType,
    file_size: request.fileSize,
  })
  return response.data
}

/**
 * Finaliza o upload de um documento
 *
 * @description
 * Esta é a última etapa do upload de documentos.
 * Após fazer upload ao MinIO, chamar esta função para:
 * - Registrar o documento no banco de dados
 * - Executar validações (ClamAV)
 * - Processar o documento (OCR, extração de dados, etc.)
 *
 * @param objectKey - Chave do objeto retornada por getPresignedUrl
 * @param type - Tipo do documento
 * @returns Documento criado
 *
 * @example
 * ```tsx
 * const document = await documentsService.finalizeUpload({
 *   objectKey: 'uploads/user-123/doc-456.pdf',
 *   type: DocumentType.RG
 * })
 * console.log('Documento criado:', document.id)
 * ```
 */
export async function finalizeUpload(request: FinalizeUploadRequest): Promise<Document> {
  const response = await apiClient.post<Document>('/uploads/finalize', {
    object_key: request.objectKey,
    type: request.type,
  })
  return response.data
}

/**
 * Deleta um documento
 *
 * @description
 * Remove o arquivo do MinIO e o registro do banco de dados.
 *
 * @param documentId - ID do documento a ser deletado
 *
 * @example
 * ```tsx
 * await documentsService.deleteDocument('doc-123')
 * console.log('Documento deletado com sucesso')
 * ```
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await apiClient.delete(`/documents/${documentId}`)
}

/**
 * Exportações nomeadas (namespace pattern)
 */
export const documentsService = {
  getDocuments,
  getDocument,
  getPresignedUrl,
  finalizeUpload,
  deleteDocument,
}

export default documentsService
