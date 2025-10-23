/**
 * Popover Component - Floating Content
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <Text>Popover content</Text>
 *   </PopoverContent>
 * </Popover>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, styled } from 'tamagui'
import { Modal, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) throw new Error('Popover components must be used within Popover')
  return context
}

export interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Popover: React.FC<PopoverProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild,
  children,
}) => {
  const { onOpenChange } = usePopoverContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onPress: () => {
        children.props.onPress?.()
        onOpenChange(true)
      },
    } as any)
  }

  return <Pressable onPress={() => onOpenChange(true)}>{children}</Pressable>
}

const ContentContainer = styled(Animated.createAnimatedComponent(YStack), {
  name: 'PopoverContent',
  backgroundColor: '$card',
  borderRadius: '$lg',
  padding: '$md',
  borderWidth: 1,
  borderColor: '$border',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  minWidth: 200,
  maxWidth: 320,
})

export const PopoverContent: React.FC<{ children: React.ReactNode; align?: 'start' | 'center' | 'end' }> = ({
  children,
  align = 'center',
}) => {
  const { open, onOpenChange } = usePopoverContext()

  if (!open) return null

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => onOpenChange(false)}>
        <ContentContainer
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          position="absolute"
          top="50%"
          left={align === 'start' ? 20 : align === 'end' ? undefined : '50%'}
          right={align === 'end' ? 20 : undefined}
          transform={align === 'center' ? [{ translateX: -150 }] : undefined}
        >
          {children}
        </ContentContainer>
      </Pressable>
    </Modal>
  )
}
