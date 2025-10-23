/**
 * Accordion Component - Collapsible Sections
 *
 * @example
 * ```tsx
 * <Accordion type="single" defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>Content 2</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

interface AccordionContextValue {
  type: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

const useAccordionContext = () => {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('Accordion components must be used within Accordion')
  return context
}

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}) => {
  const [internalValue, setInternalValue] = useState<string | string[]>(defaultValue || (type === 'single' ? '' : []))
  const value = controlledValue ?? internalValue

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      const newValue = value === itemValue ? '' : itemValue
      setInternalValue(newValue)
      onValueChange?.(newValue)
    } else {
      const currentValues = Array.isArray(value) ? value : []
      const newValues = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue]
      setInternalValue(newValues)
      onValueChange?.(newValues)
    }
  }

  return (
    <AccordionContext.Provider value={{ type, value, onValueChange: handleValueChange }}>
      <YStack space="$xs">{children}</YStack>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext)
  if (!context) throw new Error('AccordionItem components must be used within AccordionItem')
  return context
}

const ItemContainer = styled(YStack, {
  name: 'AccordionItem',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  overflow: 'hidden',
})

export const AccordionItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  const { value: accordionValue } = useAccordionContext()
  const isOpen = Array.isArray(accordionValue)
    ? accordionValue.includes(value)
    : accordionValue === value

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <ItemContainer>{children}</ItemContainer>
    </AccordionItemContext.Provider>
  )
}

const TriggerContainer = styled(XStack, {
  name: 'AccordionTrigger',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '$card',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown)

export const AccordionTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onValueChange } = useAccordionContext()
  const { value, isOpen } = useAccordionItemContext()
  const rotation = useSharedValue(isOpen ? 180 : 0)

  React.useEffect(() => {
    rotation.value = withSpring(isOpen ? 180 : 0)
  }, [isOpen])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <TriggerContainer onPress={() => onValueChange(value)}>
      <Text fontSize={16} fontWeight="500" color="$text" flex={1}>
        {children}
      </Text>
      <AnimatedChevron size={20} color="$text" style={animatedStyle} />
    </TriggerContainer>
  )
}

const ContentContainer = styled(YStack, {
  name: 'AccordionContent',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  backgroundColor: '$card',
})

export const AccordionContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useAccordionItemContext()

  if (!isOpen) return null

  return <ContentContainer>{children}</ContentContainer>
}
