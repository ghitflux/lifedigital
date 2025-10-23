/**
 * InputOTP Component - One-Time Password Input
 */

import React, { useRef } from 'react'
import { XStack, Input, styled } from 'tamagui'
import { TextInput } from 'react-native'

export interface InputOTPProps {
  length?: number
  value?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
}

const OTPInput = styled(Input, {
  name: 'OTPInput',
  width: 45,
  height: 50,
  textAlign: 'center',
  fontSize: 20,
  fontWeight: '600',
  borderRadius: '$md',
  borderWidth: 2,
  borderColor: '$border',
  backgroundColor: '$card',

  focusStyle: {
    borderColor: '$primary',
  },

  variants: {
    error: {
      true: {
        borderColor: '$danger',
      },
    },
    filled: {
      true: {
        borderColor: '$primary',
      },
    },
  } as const,
})

export const InputOTP: React.FC<InputOTPProps> = ({
  length = 6,
  value = '',
  onValueChange,
  onComplete,
  error,
}) => {
  const inputs = useRef<Array<TextInput | null>>([])
  const digits = value.padEnd(length, ' ').split('').slice(0, length)

  const handleChange = (index: number, text: string) => {
    const newDigits = [...digits]
    newDigits[index] = text
    const newValue = newDigits.join('').trim()
    onValueChange?.(newValue)

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }

    if (newValue.length === length) {
      onComplete?.(newValue)
    }
  }

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <XStack space="$xs" justifyContent="center">
      {Array.from({ length }).map((_, index) => (
        <OTPInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref as any)}
          value={digits[index]?.trim() || ''}
          onChangeText={(text) => handleChange(index, text.slice(0, 1))}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          maxLength={1}
          keyboardType="number-pad"
          error={error}
          filled={!!digits[index]?.trim()}
        />
      ))}
    </XStack>
  )
}
