/**
 * Skeleton Component
 *
 * Loading placeholder with shimmer animation.
 *
 * @example
 * ```tsx
 * <Skeleton width={200} height={20} />
 * <Skeleton circle width={50} height={50} />
 * <Skeleton variant="text" count={3} />
 * ```
 */

import React from 'react'
import { YStack, YStackProps, styled } from 'tamagui'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export interface SkeletonProps extends YStackProps {
  /** Skeleton variant */
  variant?: 'rectangular' | 'circular' | 'text'
  /** Number of skeleton lines (for text variant) */
  count?: number
  /** Animation enabled */
  animated?: boolean
}

const SkeletonBase = styled(YStack, {
  name: 'Skeleton',
  backgroundColor: '$surface',
  overflow: 'hidden',

  variants: {
    variant: {
      rectangular: {
        borderRadius: '$md',
      },
      circular: {
        borderRadius: '$full',
      },
      text: {
        borderRadius: '$sm',
        height: 16,
      },
    },
    animated: {
      true: {
        opacity: 1,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'rectangular',
    animated: true,
  },
})

const AnimatedSkeleton = Animated.createAnimatedComponent(SkeletonBase)

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', count = 1, animated = true, width, height, ...props }, ref) => {
    const opacity = useSharedValue(1)

    useEffect(() => {
      if (animated) {
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 800 }),
            withTiming(1, { duration: 800 })
          ),
          -1,
          false
        )
      }
    }, [animated])

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }))

    if (variant === 'text' && count > 1) {
      return (
        <YStack space="$sm">
          {Array.from({ length: count }).map((_, index) => (
            <AnimatedSkeleton
              key={index}
              ref={index === 0 ? ref : undefined}
              variant="text"
              width={index === count - 1 ? '80%' : width || '100%'}
              height={height || 16}
              style={animated ? animatedStyle : undefined}
              {...props}
            />
          ))}
        </YStack>
      )
    }

    return (
      <AnimatedSkeleton
        ref={ref}
        variant={variant}
        width={width}
        height={height}
        style={animated ? animatedStyle : undefined}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'
