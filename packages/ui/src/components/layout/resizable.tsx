/**
 * Resizable Component
 *
 * A container that can be resized by dragging handles (simplified version for mobile).
 *
 * @example
 * ```tsx
 * <ResizablePanel defaultSize={300} minSize={200} maxSize={500}>
 *   <Content />
 * </ResizablePanel>
 * ```
 */

import React, { useState } from 'react'
import { YStack, YStackProps, XStack, styled } from 'tamagui'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

export interface ResizablePanelProps extends YStackProps {
  /** Default size (width or height depending on direction) */
  defaultSize?: number
  /** Minimum size */
  minSize?: number
  /** Maximum size */
  maxSize?: number
  /** Resize direction */
  direction?: 'horizontal' | 'vertical'
  /** Callback when size changes */
  onResize?: (size: number) => void
}

const Panel = styled(YStack, {
  name: 'ResizablePanel',
  backgroundColor: '$card',
  borderRadius: '$md',
  overflow: 'hidden',
})

const Handle = styled(YStack, {
  name: 'ResizableHandle',
  backgroundColor: '$border',
  cursor: 'col-resize',

  variants: {
    direction: {
      horizontal: {
        width: 4,
        height: '100%',
        cursor: 'col-resize',
      },
      vertical: {
        width: '100%',
        height: 4,
        cursor: 'row-resize',
      },
    },
  } as const,

  defaultVariants: {
    direction: 'horizontal',
  },
})

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      children,
      defaultSize = 300,
      minSize = 100,
      maxSize = 800,
      direction = 'horizontal',
      onResize,
      ...props
    },
    ref
  ) => {
    const [size, setSize] = useState(defaultSize)
    const sizeValue = useSharedValue(defaultSize)

    const handleResize = (delta: number) => {
      const newSize = Math.max(minSize, Math.min(maxSize, size + delta))
      setSize(newSize)
      sizeValue.value = withSpring(newSize)
      onResize?.(newSize)
    }

    const panGesture = Gesture.Pan()
      .onUpdate((e) => {
        const delta = direction === 'horizontal' ? e.translationX : e.translationY
        handleResize(delta)
      })

    const animatedStyle = useAnimatedStyle(() => ({
      [direction === 'horizontal' ? 'width' : 'height']: sizeValue.value,
    }))

    return (
      <XStack space="$xs">
        <Animated.View style={[animatedStyle]}>
          <Panel ref={ref} {...props}>
            {children}
          </Panel>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Handle direction={direction} />
        </GestureDetector>
      </XStack>
    )
  }
)

ResizablePanel.displayName = 'ResizablePanel'
