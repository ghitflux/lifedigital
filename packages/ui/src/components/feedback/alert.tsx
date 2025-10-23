/**
 * Alert Component
 *
 * Display important messages with different severity levels.
 *
 * @example
 * ```tsx
 * <Alert variant="info" title="Info">This is an informational alert</Alert>
 * <Alert variant="success" icon={<Check />}>Operation successful</Alert>
 * <Alert variant="warning">Please check your input</Alert>
 * <Alert variant="danger" dismissible onDismiss={() => {}}>Error occurred</Alert>
 * ```
 */

import React, { useState } from 'react'
import { XStack, YStack, Text, YStackProps, styled } from 'tamagui'
import { AlertCircle, CheckCircle, Info, XCircle, X } from '@tamagui/lucide-icons'

export interface AlertProps extends YStackProps {
  /** Alert variant/severity */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'
  /** Alert title */
  title?: string
  /** Custom icon */
  icon?: React.ReactNode
  /** Show dismiss button */
  dismissible?: boolean
  /** Callback when dismissed */
  onDismiss?: () => void
}

const AlertContainer = styled(YStack, {
  name: 'Alert',
  borderRadius: '$md',
  padding: '$md',
  borderLeftWidth: 4,

  variants: {
    variant: {
      default: {
        backgroundColor: '$card',
        borderLeftColor: '$border',
      },
      info: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderLeftColor: '$primary',
      },
      success: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderLeftColor: '$success',
      },
      warning: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderLeftColor: '$warning',
      },
      danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderLeftColor: '$danger',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

const iconMap = {
  default: AlertCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  danger: XCircle,
}

const colorMap = {
  default: '$text',
  info: '$primary',
  success: '$success',
  warning: '$warning',
  danger: '$danger',
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', title, icon, dismissible, onDismiss, ...props }, ref) => {
    const [visible, setVisible] = useState(true)

    const IconComponent = icon || iconMap[variant]
    const iconColor = colorMap[variant]

    const handleDismiss = () => {
      setVisible(false)
      onDismiss?.()
    }

    if (!visible) return null

    return (
      <AlertContainer ref={ref} variant={variant} {...props}>
        <XStack space="$sm" alignItems="flex-start">
          {IconComponent && (
            <YStack marginTop={2}>
              {React.isValidElement(IconComponent) ? (
                IconComponent
              ) : (
                <IconComponent size={20} color={iconColor} />
              )}
            </YStack>
          )}

          <YStack flex={1} space="$xs">
            {title && (
              <Text fontWeight="600" color={iconColor} fontSize={16}>
                {title}
              </Text>
            )}
            <Text color="$text" fontSize={14} lineHeight={20}>
              {children}
            </Text>
          </YStack>

          {dismissible && (
            <YStack
              onPress={handleDismiss}
              cursor="pointer"
              padding="$xs"
              borderRadius="$sm"
              hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            >
              <X size={16} color="$muted" />
            </YStack>
          )}
        </XStack>
      </AlertContainer>
    )
  }
)

Alert.displayName = 'Alert'
