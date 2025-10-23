/**
 * API Services - Exportações centralizadas
 *
 * @description
 * Este arquivo exporta todos os services da API.
 * Facilita a importação em qualquer parte do app.
 *
 * @example
 * ```tsx
 * import { authService, marginService, simulationsService } from '@/services/api'
 *
 * const user = await authService.getMe()
 * const margin = await marginService.getMargin()
 * const simulations = await simulationsService.getSimulations()
 * ```
 */

// Axios client e helpers
export { default as apiClient, getErrorMessage } from './axios-client'

// Auth service
export {
  authService,
  loginWithGoogle,
  refreshToken,
  logout,
  getMe,
} from './auth.service'
export type {
  User,
  LoginWithGoogleRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './auth.service'

// Profile service
export {
  profileService,
  getProfile,
  updateProfile,
  updateCPF,
  updateWhatsApp,
  verifyOTP,
} from './profile.service'
export type {
  UpdateProfileRequest,
  UpdateCPFRequest,
  UpdateCPFResponse,
  UpdateWhatsAppRequest,
  UpdateWhatsAppResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './profile.service'

// Documents service
export {
  documentsService,
  getDocuments,
  getDocument,
  getPresignedUrl,
  finalizeUpload,
  deleteDocument,
  DocumentStatus,
  DocumentType,
} from './documents.service'
export type {
  Document,
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  FinalizeUploadRequest,
} from './documents.service'

// Margin service
export {
  marginService,
  getMargin,
  getMarginHistory,
} from './margin.service'
export type {
  Margin,
  MarginHistory,
} from './margin.service'

// Simulations service
export {
  simulationsService,
  getSimulations,
  getSimulation,
  createSimulation,
  approveSimulation,
  cancelSimulation,
  SimulationStatus,
  ProductType,
} from './simulations.service'
export type {
  Simulation,
  CreateSimulationRequest,
} from './simulations.service'
