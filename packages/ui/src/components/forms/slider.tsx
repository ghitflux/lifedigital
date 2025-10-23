/**
 * Slider Component
 */

import React from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

export interface SliderProps {
  value?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  disabled?: boolean
}

const Track = styled(YStack, {
  name: 'SliderTrack',
  height: 4,
  backgroundColor: '$surface',
  borderRadius: '$full',
  width: '100%',
  position: 'relative',
})

const AnimatedYStack = Animated.createAnimatedComponent(YStack)

export const Slider: React.FC<SliderProps> = ({
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue,
  disabled,
}) => {
  const position = useSharedValue(((value - min) / (max - min)) * 100)

  const handleValueChange = (newValue: number) => {
    const stepped = Math.round(newValue / step) * step
    const clamped = Math.max(min, Math.min(max, stepped))
    onValueChange?.(clamped)
  }

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((e) => {
      const percent = Math.max(0, Math.min(100, (e.x / 300) * 100))
      position.value = percent
      const newValue = min + (percent / 100) * (max - min)
      runOnJS(handleValueChange)(newValue)
    })

  const trackStyle = useAnimatedStyle(() => ({
    width: `${position.value}%`,
  }))

  const thumbStyle = useAnimatedStyle(() => ({
    left: `${position.value}%`,
  }))

  return (
    <YStack space="$xs">
      <GestureDetector gesture={panGesture}>
        <Track>
          <AnimatedYStack
            height="100%"
            backgroundColor="$primary"
            borderRadius="$full"
            style={trackStyle}
          />
          <AnimatedYStack
            position="absolute"
            width={20}
            height={20}
            backgroundColor="white"
            borderRadius="$full"
            borderWidth={2}
            borderColor="$primary"
            top={-8}
            style={thumbStyle}
            marginLeft={-10}
          />
        </Track>
      </GestureDetector>

      {showValue && (
        <XStack justifyContent="space-between">
          <Text fontSize={12} color="$muted">
            {min}
          </Text>
          <Text fontSize={12} fontWeight="600" color="$text">
            {value}
          </Text>
          <Text fontSize={12} color="$muted">
            {max}
          </Text>
        </XStack>
      )}
    </YStack>
  )
}
