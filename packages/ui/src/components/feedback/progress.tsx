/**
 * Progress Component
 *
 * Progress indicator with determinate and indeterminate states.
 *
 * @example
 * ```tsx
 * <Progress value={50} />
 * <Progress value={75} variant="success" />
 * <Progress indeterminate />
 * <Progress value={30} showLabel />
 * ```
 */

import React, { useEffect } from 'react'
import { YStack, XStack, Text, YStackProps, styled } from 'tamagui'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated'

export interface ProgressProps extends Omit<YStackProps, 'value'> {
  /** Progress value (0-100) */
  value?: number
  /** Progress variant/color */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  /** Size/height of progress bar */
  size?: 'sm' | 'md' | 'lg'
  /** Indeterminate/loading state */
  indeterminate?: boolean
  /** Show percentage label */
  showLabel?: boolean
}

const ProgressContainer = styled(YStack, {
  name: 'ProgressContainer',
  backgroundColor: '$surface',
  borderRadius: '$full',
  overflow: 'hidden',

  variants: {
    size: {
      sm: {
        height: 4,
      },
      md: {
        height: 8,
      },
      lg: {
        height: 12,
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

const variantColorMap = {
  default: '$text',
  primary: '$primary',
  success: '$success',
  warning: '$warning',
  danger: '$danger',
}

const AnimatedYStack = Animated.createAnimatedComponent(YStack)

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      variant = 'primary',
      size = 'md',
      indeterminate,
      showLabel,
      ...props
    },
    ref
  ) => {
    const progress = useSharedValue(0)
    const indeterminateProgress = useSharedValue(0)

    useEffect(() => {
      if (indeterminate) {
        indeterminateProgress.value = withRepeat(
          withTiming(1, { duration: 1500, easing: Easing.linear }),
          -1,
          false
        )
      } else {
        progress.value = withSpring(Math.min(100, Math.max(0, value)) / 100, {
          damping: 15,
          stiffness: 100,
        })
      }
    }, [value, indeterminate])

    const progressStyle = useAnimatedStyle(() => ({
      width: `${progress.value * 100}%`,
    }))

    const indeterminateStyle = useAnimatedStyle(() => ({
      width: '30%',
      transform: [
        {
          translateX: indeterminateProgress.value * 350 - 100,
        },
      ],
    }))

    return (
      <YStack space="$xs" width="100%">
        <ProgressContainer ref={ref} size={size} width="100%" {...props}>
          <AnimatedYStack
            height="100%"
            backgroundColor={variantColorMap[variant]}
            borderRadius="$full"
            style={indeterminate ? indeterminateStyle : progressStyle}
          />
        </ProgressContainer>

        {showLabel && !indeterminate && (
          <XStack justifyContent="space-between">
            <Text fontSize={12} color="$muted">
              {Math.round(value)}%
            </Text>
          </XStack>
        )}
      </YStack>
    )
  }
)

Progress.displayName = 'Progress'
