/**
 * RadioGroup Component
 */

import React from 'react'
import { YStack, XStack, Text, Circle, styled } from 'tamagui'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  direction?: 'vertical' | 'horizontal'
}

const RadioButton = styled(Circle, {
  name: 'RadioButton',
  size: 20,
  borderWidth: 2,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    checked: {
      true: {
        borderColor: '$primary',
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

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onValueChange,
  direction = 'vertical',
}) => {
  const Container = direction === 'vertical' ? YStack : XStack

  return (
    <Container space="$sm">
      {options.map((option) => {
        const isChecked = option.value === value
        return (
          <XStack
            key={option.value}
            space="$sm"
            alignItems="center"
            onPress={() => !option.disabled && onValueChange?.(option.value)}
            cursor={option.disabled ? 'not-allowed' : 'pointer'}
          >
            <RadioButton checked={isChecked} disabled={option.disabled}>
              {isChecked && <Circle size={10} backgroundColor="$primary" />}
            </RadioButton>
            <Text fontSize={14} color={option.disabled ? '$muted' : '$text'}>
              {option.label}
            </Text>
          </XStack>
        )
      })}
    </Container>
  )
}
