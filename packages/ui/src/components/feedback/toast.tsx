/**
 * Toast Component
 *
 * Individual toast notification component.
 * Usually used internally by Toaster, not directly.
 */

import React, { useEffect } from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import { X, CheckCircle, AlertCircle, Info, XCircle } from '@tamagui/lucide-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { Toast as ToastType } from '../../hooks/use-toast'

export interface ToastProps extends ToastType {
  onDismiss: (id: string) => void
}

const ToastContainer = styled(YStack, {
  name: 'Toast',
  borderRadius: '$lg',
  padding: '$md',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 6,
  minWidth: 300,
  maxWidth: 400,

  variants: {
    variant: {
      default: {
        backgroundColor: '$card',
        borderWidth: 1,
        borderColor: '$border',
      },
      success: {
        backgroundColor: '$card',
        borderLeftWidth: 4,
        borderLeftColor: '$success',
      },
      warning: {
        backgroundColor: '$card',
        borderLeftWidth: 4,
        borderLeftColor: '$warning',
      },
      danger: {
        backgroundColor: '$card',
        borderLeftWidth: 4,
        borderLeftColor: '$danger',
      },
      info: {
        backgroundColor: '$card',
        borderLeftWidth: 4,
        borderLeftColor: '$primary',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
  },
})

const AnimatedToast = Animated.createAnimatedComponent(ToastContainer)

const iconMap = {
  default: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  danger: XCircle,
  info: Info,
}

const iconColorMap = {
  default: '$text',
  success: '$success',
  warning: '$warning',
  danger: '$danger',
  info: '$primary',
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  action,
  onDismiss,
}) => {
  const translateY = useSharedValue(-100)
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(0)

  useEffect(() => {
    // Enter animation
    translateY.value = withSpring(0, { damping: 15 })
    opacity.value = withTiming(1, { duration: 200 })
  }, [])

  const handleDismiss = () => {
    // Exit animation
    opacity.value = withTiming(0, { duration: 150 })
    translateY.value = withTiming(-100, { duration: 150 }, () => {
      runOnJS(onDismiss)(id)
    })
  }

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX
      }
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        runOnJS(handleDismiss)()
      } else {
        translateX.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }))

  const IconComponent = iconMap[variant]

  return (
    <GestureDetector gesture={panGesture}>
      <AnimatedToast variant={variant} style={animatedStyle}>
        <XStack space="$sm" alignItems="flex-start">
          <YStack marginTop={2}>
            <IconComponent size={20} color={iconColorMap[variant]} />
          </YStack>

          <YStack flex={1} space="$xs">
            {title && (
              <Text fontWeight="600" fontSize={14} color="$text">
                {title}
              </Text>
            )}
            {description && (
              <Text fontSize={13} color="$muted" lineHeight={18}>
                {description}
              </Text>
            )}
            {action && (
              <Text
                fontSize={13}
                color="$primary"
                fontWeight="600"
                onPress={action.onClick}
                cursor="pointer"
                marginTop="$xs"
              >
                {action.label}
              </Text>
            )}
          </YStack>

          <YStack
            onPress={handleDismiss}
            cursor="pointer"
            padding="$xs"
            borderRadius="$sm"
            hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
          >
            <X size={16} color="$muted" />
          </YStack>
        </XStack>
      </AnimatedToast>
    </GestureDetector>
  )
}
