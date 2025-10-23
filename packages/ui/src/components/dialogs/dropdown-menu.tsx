/**
 * DropdownMenu Component
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Menu</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onPress={() => {}}>Item 1</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem onPress={() => {}}>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Modal, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Check } from '@tamagui/lucide-icons'

interface DropdownContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('Dropdown components must be used within DropdownMenu')
  return context
}

export interface DropdownMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <DropdownContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DropdownContext.Provider>
  )
}

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild,
  children,
}) => {
  const { onOpenChange } = useDropdownContext()

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
  name: 'DropdownMenuContent',
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

export const DropdownMenuContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, onOpenChange } = useDropdownContext()

  if (!open) return null

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={{ flex: 1 }} onPress={() => onOpenChange(false)}>
        <ContentContainer
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          position="absolute"
          top="15%"
          right={20}
        >
          {children}
        </ContentContainer>
      </Pressable>
    </Modal>
  )
}

export interface DropdownMenuItemProps {
  onPress?: () => void
  children: React.ReactNode
  icon?: React.ReactNode
  checked?: boolean
  disabled?: boolean
}

export const DropdownMenuItem = styled(XStack, {
  name: 'DropdownMenuItem',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  space: '$sm',
  alignItems: 'center',

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const DropdownMenuSeparator = styled(YStack, {
  name: 'DropdownMenuSeparator',
  height: 1,
  backgroundColor: '$border',
  marginVertical: '$xs',
})

export const DropdownMenuCheckboxItem: React.FC<DropdownMenuItemProps> = ({
  onPress,
  children,
  checked,
  disabled,
}) => {
  const { onOpenChange } = useDropdownContext()

  return (
    <DropdownMenuItem
      disabled={disabled}
      onPress={() => {
        if (!disabled) {
          onPress?.()
          onOpenChange(false)
        }
      }}
    >
      {checked && <Check size={16} color="$primary" />}
      {!checked && <YStack width={16} />}
      <Text fontSize={14} color="$text">
        {children}
      </Text>
    </DropdownMenuItem>
  )
}
