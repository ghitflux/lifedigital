/**
 * Toaster Component
 *
 * Container for displaying toast notifications.
 * Add this to your app root to enable toasts.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   )
 * }
 * ```
 */

import React from 'react'
import { YStack, YStackProps } from 'tamagui'
import { useToastStore } from '../../hooks/use-toast'
import { Toast } from './toast'
import { Platform } from 'react-native'

export interface ToasterProps extends YStackProps {
  /** Position of toasts */
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
  /** Maximum number of toasts to display */
  maxToasts?: number
}

const positionStyles = {
  top: {
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },
  'top-right': {
    top: 20,
    right: 20,
    alignItems: 'flex-end' as const,
  },
  'top-left': {
    top: 20,
    left: 20,
    alignItems: 'flex-start' as const,
  },
  bottom: {
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },
  'bottom-right': {
    bottom: 20,
    right: 20,
    alignItems: 'flex-end' as const,
  },
  'bottom-left': {
    bottom: 20,
    left: 20,
    alignItems: 'flex-start' as const,
  },
}

export const Toaster: React.FC<ToasterProps> = ({
  position = 'top-right',
  maxToasts = 5,
  ...props
}) => {
  const { toasts, dismissToast } = useToastStore()
  const visibleToasts = toasts.slice(0, maxToasts)

  if (visibleToasts.length === 0) return null

  return (
    <YStack
      position="absolute"
      zIndex={9999}
      pointerEvents="box-none"
      space="$sm"
      {...positionStyles[position]}
      {...(Platform.OS === 'web' && {
        // @ts-ignore - web only
        style: { position: 'fixed' },
      })}
      {...props}
    >
      {visibleToasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
      ))}
    </YStack>
  )
}
