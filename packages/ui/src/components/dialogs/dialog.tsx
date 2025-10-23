/**
 * Dialog Component - Modal Dialog with Overlay
 *
 * @example
 * ```tsx
 * <Dialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <Button>Close</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Modal, Pressable } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { X } from '@tamagui/lucide-icons'

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) throw new Error('Dialog components must be used within Dialog')
  return context
}

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild,
  children,
}) => {
  const { onOpenChange } = useDialogContext()

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

const Overlay = styled(Animated.View, {
  name: 'DialogOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
})

const ContentContainer = styled(YStack, {
  name: 'DialogContent',
  backgroundColor: '$card',
  borderRadius: '$xl',
  padding: '$lg',
  maxWidth: 500,
  width: '90%',
  maxHeight: '80%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
})

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, onOpenChange } = useDialogContext()

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => onOpenChange(false)}
      >
        <Overlay entering={FadeIn} exiting={FadeOut} />
        <Pressable style={{ width: '90%', maxWidth: 500 }} onPress={(e) => e.stopPropagation()}>
          <ContentContainer>
            <XStack justifyContent="flex-end" marginBottom="$sm">
              <Pressable onPress={() => onOpenChange(false)}>
                <X size={20} color="$muted" />
              </Pressable>
            </XStack>
            {children}
          </ContentContainer>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export const DialogHeader = styled(YStack, {
  name: 'DialogHeader',
  space: '$xs',
  marginBottom: '$md',
})

export const DialogTitle = styled(Text, {
  name: 'DialogTitle',
  fontSize: 20,
  fontWeight: '600',
  color: '$text',
})

export const DialogDescription = styled(Text, {
  name: 'DialogDescription',
  fontSize: 14,
  color: '$muted',
  lineHeight: 20,
})

export const DialogFooter = styled(XStack, {
  name: 'DialogFooter',
  space: '$sm',
  justifyContent: 'flex-end',
  marginTop: '$lg',
})
