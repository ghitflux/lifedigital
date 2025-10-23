/**
 * ToggleGroup Component - Toggle Button Group
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" value={value} onValueChange={setValue}>
 *   <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
 *   <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
 *   <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */

import React, { createContext, useContext } from 'react'
import { XStack, YStack, styled } from 'tamagui'

interface ToggleGroupContextValue {
  type: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (value: string) => void
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext)
  if (!context) throw new Error('ToggleGroupItem must be used within ToggleGroup')
  return context
}

export interface ToggleGroupProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  type = 'single',
  value = type === 'single' ? '' : [],
  onValueChange,
  children,
}) => {
  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      onValueChange?.(itemValue === value ? '' : itemValue)
    } else {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue]
      onValueChange?.(newValues)
    }
  }

  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <XStack space="$xs">{children}</XStack>
    </ToggleGroupContext.Provider>
  )
}

const ToggleItemButton = styled(YStack, {
  name: 'ToggleGroupItem',
  paddingHorizontal: '$sm',
  paddingVertical: '$sm',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  minWidth: 40,
  minHeight: 40,

  variants: {
    pressed: {
      true: {
        backgroundColor: '$surface',
        borderColor: '$primary',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const ToggleGroupItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const { value: groupValue, onValueChange } = useToggleGroupContext()
  const isPressed = Array.isArray(groupValue) ? groupValue.includes(value) : groupValue === value

  return (
    <ToggleItemButton pressed={isPressed} onPress={() => onValueChange(value)}>
      {children}
    </ToggleItemButton>
  )
}
