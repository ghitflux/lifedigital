/**
 * useToast Hook
 *
 * Hook for displaying toast notifications.
 *
 * @example
 * ```tsx
 * const { toast, dismiss, dismissAll } = useToast()
 *
 * toast({
 *   title: "Success",
 *   description: "Your changes have been saved",
 *   variant: "success"
 * })
 * ```
 */

import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  dismissToast: (id: string) => void
  dismissAll: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, newToast.duration)
    }

    return id
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  dismissAll: () => {
    set({ toasts: [] })
  },
}))

export function useToast() {
  const { addToast, dismissToast, dismissAll } = useToastStore()

  const toast = (props: Omit<Toast, 'id'>) => {
    return addToast(props)
  }

  // Convenience methods
  toast.success = (title: string, description?: string) => {
    return addToast({ title, description, variant: 'success' })
  }

  toast.error = (title: string, description?: string) => {
    return addToast({ title, description, variant: 'danger' })
  }

  toast.warning = (title: string, description?: string) => {
    return addToast({ title, description, variant: 'warning' })
  }

  toast.info = (title: string, description?: string) => {
    return addToast({ title, description, variant: 'info' })
  }

  return {
    toast,
    dismiss: dismissToast,
    dismissAll,
  }
}
