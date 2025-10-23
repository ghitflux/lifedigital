/**
 * TanStack Query Hooks - Exportações centralizadas
 *
 * @description
 * Este arquivo exporta todos os hooks customizados do TanStack Query.
 * Facilita a importação em qualquer parte do app.
 *
 * @example
 * ```tsx
 * import { useUser, useMargin, useSimulations } from '@/lib/hooks'
 * ```
 */

// Auth hooks
export {
  useUser,
  useLoginWithGoogle,
  useRefreshToken,
  useLogout,
} from './useAuth'

// Profile hooks
export {
  useProfile,
  useUpdateCPF,
  useUpdateWhatsApp,
  useVerifyOTP,
  useUpdateProfile,
} from './useProfile'

// Documents hooks
export {
  useDocuments,
  useDocument,
  useGetPresignedUrl,
  useUploadDocument,
  useDeleteDocument,
  DocumentStatus,
  DocumentType,
} from './useDocuments'

// Margin hooks
export {
  useMargin,
  useMarginHistory,
  useMarginPercentage,
  useMarginStatus,
} from './useMargin'

// Simulations hooks
export {
  useSimulations,
  useSimulation,
  useCreateSimulation,
  useApproveSimulation,
  useCancelSimulation,
  usePendingSimulations,
  useApprovedSimulations,
  SimulationStatus,
  ProductType,
} from './useSimulations'
