/**
 * Tooltip Component - Hover/Press Hint
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */

import React, { useState } from 'react'
import { YStack, Text, styled } from 'tamagui'
import { Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export interface TooltipProps {
  content: string
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const TooltipContainer = styled(Animated.createAnimatedComponent(YStack), {
  name: 'Tooltip',
  backgroundColor: '$text',
  borderRadius: '$md',
  paddingHorizontal: '$sm',
  paddingVertical: '$xs',
  maxWidth: 200,
  position: 'absolute',
  zIndex: 9999,
})

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top' }) => {
  const [visible, setVisible] = useState(false)

  const positionStyles = {
    top: { bottom: '100%', marginBottom: 8 },
    bottom: { top: '100%', marginTop: 8 },
    left: { right: '100%', marginRight: 8 },
    right: { left: '100%', marginLeft: 8 },
  }

  return (
    <YStack position="relative">
      <Pressable
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        onLongPress={() => setVisible(true)}
      >
        {children}
      </Pressable>

      {visible && (
        <TooltipContainer entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} {...positionStyles[side]}>
          <Text fontSize={12} color="$bg" textAlign="center">
            {content}
          </Text>
        </TooltipContainer>
      )}
    </YStack>
  )
}
