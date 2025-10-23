/**
 * Collapsible Component - Single Collapsible Section
 *
 * @example
 * ```tsx
 * <Collapsible open={isOpen} onOpenChange={setIsOpen}>
 *   <CollapsibleTrigger asChild>
 *     <Button>Toggle</Button>
 *   </CollapsibleTrigger>
 *   <CollapsibleContent>
 *     <Text>Hidden content</Text>
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, styled } from 'tamagui'
import { Pressable } from 'react-native'

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null)

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext)
  if (!context) throw new Error('Collapsible components must be used within Collapsible')
  return context
}

export interface CollapsibleProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  children: React.ReactNode
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <YStack>{children}</YStack>
    </CollapsibleContext.Provider>
  )
}

export const CollapsibleTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild,
  children,
}) => {
  const { open, onOpenChange } = useCollapsibleContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onPress: () => {
        children.props.onPress?.()
        onOpenChange(!open)
      },
    } as any)
  }

  return <Pressable onPress={() => onOpenChange(!open)}>{children}</Pressable>
}

const ContentContainer = styled(YStack, {
  name: 'CollapsibleContent',
  overflow: 'hidden',
})

export const CollapsibleContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = useCollapsibleContext()

  if (!open) return null

  return <ContentContainer>{children}</ContentContainer>
}
