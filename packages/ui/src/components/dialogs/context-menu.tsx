/**
 * ContextMenu Component - Right-click/Long-press Menu
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger>
 *     <Text>Long press me</Text>
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem onPress={() => {}}>Copy</ContextMenuItem>
 *     <ContextMenuItem onPress={() => {}}>Paste</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Modal, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

interface ContextMenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: { x: number; y: number }
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)

const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext)
  if (!context) throw new Error('ContextMenu components must be used within ContextMenu')
  return context
}

export interface ContextMenuProps {
  children: React.ReactNode
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <ContextMenuContext.Provider value={{ open, onOpenChange: setOpen, position }}>
      {children}
    </ContextMenuContext.Provider>
  )
}

export const ContextMenuTrigger: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { onOpenChange } = useContextMenuContext()

  return React.cloneElement(children, {
    ...children.props,
    onLongPress: (e: any) => {
      children.props.onLongPress?.(e)
      onOpenChange(true)
    },
  })
}

const ContentContainer = styled(Animated.createAnimatedComponent(YStack), {
  name: 'ContextMenuContent',
  backgroundColor: '$card',
  borderRadius: '$lg',
  borderWidth: 1,
  borderColor: '$border',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  minWidth: 180,
})

export const ContextMenuContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, onOpenChange, position } = useContextMenuContext()

  if (!open) return null

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => onOpenChange(false)}>
        <ContentContainer
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          position="absolute"
          top={position.y}
          left={position.x}
        >
          {children}
        </ContentContainer>
      </Pressable>
    </Modal>
  )
}

export const ContextMenuItem = styled(XStack, {
  name: 'ContextMenuItem',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  space: '$sm',
  alignItems: 'center',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})
