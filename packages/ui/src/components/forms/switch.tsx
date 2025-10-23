/**
 * Switch Component
 */

import React from 'react'
import { XStack, Text, styled } from 'tamagui'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

const SwitchTrack = styled(XStack, {
  name: 'SwitchTrack',
  width: 44,
  height: 24,
  borderRadius: '$full',
  padding: 2,
  cursor: 'pointer',

  variants: {
    checked: {
      true: {
        backgroundColor: '$primary',
      },
      false: {
        backgroundColor: '$surface',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,
})

const AnimatedXStack = Animated.createAnimatedComponent(XStack)

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, label, disabled }) => {
  const translateX = useSharedValue(checked ? 20 : 0)

  React.useEffect(() => {
    translateX.value = withSpring(checked ? 20 : 0)
  }, [checked])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <XStack
      space="$sm"
      alignItems="center"
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <SwitchTrack checked={checked} disabled={disabled}>
        <AnimatedXStack
          width={20}
          height={20}
          borderRadius="$full"
          backgroundColor="white"
          style={animatedStyle}
        />
      </SwitchTrack>
      {label && (
        <Text fontSize={14} color={disabled ? '$muted' : '$text'}>
          {label}
        </Text>
      )}
    </XStack>
  )
}
