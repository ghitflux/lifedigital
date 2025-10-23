/**
 * Sonner Component
 *
 * Simplified toast notification system with a cleaner API.
 * Alternative to the full Toast/Toaster system.
 *
 * @example
 * ```tsx
 * import { sonner } from '@life/ui'
 *
 * sonner.success('Changes saved!')
 * sonner.error('Something went wrong')
 * sonner('Custom message', { duration: 3000 })
 * ```
 */

import { useToast } from '../../hooks/use-toast'

// Export a singleton instance for easy access
let toastInstance: ReturnType<typeof useToast> | null = null

export function initSonner(instance: ReturnType<typeof useToast>) {
  toastInstance = instance
}

function getToastInstance() {
  if (!toastInstance) {
    console.warn('Sonner not initialized. Call initSonner() first or use useToast() directly.')
    return null
  }
  return toastInstance
}

export const sonner = (message: string, options?: {
  description?: string
  duration?: number
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}) => {
  const instance = getToastInstance()
  if (!instance) return

  return instance.toast({
    title: message,
    description: options?.description,
    duration: options?.duration,
    variant: options?.variant,
  })
}

sonner.success = (message: string, description?: string) => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.toast.success(message, description)
}

sonner.error = (message: string, description?: string) => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.toast.error(message, description)
}

sonner.warning = (message: string, description?: string) => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.toast.warning(message, description)
}

sonner.info = (message: string, description?: string) => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.toast.info(message, description)
}

sonner.dismiss = (id: string) => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.dismiss(id)
}

sonner.dismissAll = () => {
  const instance = getToastInstance()
  if (!instance) return
  return instance.dismissAll()
}

// React component to initialize sonner
import React, { useEffect } from 'react'

export const SonnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast()

  useEffect(() => {
    initSonner(toast)
  }, [toast])

  return <>{children}</>
}
