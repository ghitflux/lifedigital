/**
 * Select Component
 */

import React, { useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Check, ChevronDown } from '@tamagui/lucide-icons'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const SelectTrigger = styled(XStack, {
  name: 'SelectTrigger',
  height: 40,
  paddingHorizontal: '$md',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: '$card',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',

  variants: {
    error: {
      true: {
        borderColor: '$danger',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,

  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
  },
})

const OptionsContainer = styled(YStack, {
  name: 'SelectOptions',
  backgroundColor: '$card',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  marginTop: '$xs',
  maxHeight: 200,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
})

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <YStack>
      <SelectTrigger
        error={error}
        disabled={disabled}
        onPress={() => !disabled && setIsOpen(!isOpen)}
      >
        <Text fontSize={14} color={selectedOption ? '$text' : '$muted'}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown size={16} color="$muted" />
      </SelectTrigger>

      {isOpen && !disabled && (
        <OptionsContainer>
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <XStack
                key={option.value}
                paddingHorizontal="$md"
                paddingVertical="$sm"
                cursor={option.disabled ? 'not-allowed' : 'pointer'}
                opacity={option.disabled ? 0.5 : 1}
                backgroundColor={isSelected ? '$surface' : 'transparent'}
                hoverStyle={{ backgroundColor: '$surface' }}
                onPress={() => {
                  if (!option.disabled) {
                    onValueChange?.(option.value)
                    setIsOpen(false)
                  }
                }}
                space="$sm"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text fontSize={14} color="$text">
                  {option.label}
                </Text>
                {isSelected && <Check size={16} color="$primary" />}
              </XStack>
            )
          })}
        </OptionsContainer>
      )}
    </YStack>
  )
}
