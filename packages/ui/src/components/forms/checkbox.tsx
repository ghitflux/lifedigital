/**
 * Checkbox Component
 */

import React from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  error?: boolean
}

const CheckboxBox = styled(YStack, {
  name: 'CheckboxBox',
  width: 20,
  height: 20,
  borderRadius: '$sm',
  borderWidth: 2,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    checked: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    error: {
      true: {
        borderColor: '$danger',
      },
    },
  } as const,
})

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  disabled,
  error,
}) => {
  return (
    <XStack
      space="$sm"
      alignItems="center"
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <CheckboxBox checked={checked} disabled={disabled} error={error}>
        {checked && <Check size={14} color="white" />}
      </CheckboxBox>
      {label && (
        <Text fontSize={14} color={disabled ? '$muted' : '$text'}>
          {label}
        </Text>
      )}
    </XStack>
  )
}
