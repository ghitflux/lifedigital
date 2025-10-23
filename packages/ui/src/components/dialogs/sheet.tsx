/**
 * Sheet Component - Bottom Sheet
 *
 * @example
 * ```tsx
 * <Sheet open={isOpen} onOpenChange={setIsOpen}>
 *   <SheetTrigger asChild>
 *     <Button>Open Sheet</Button>
 *   </SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>Title</SheetTitle>
 *     </SheetHeader>
 *     <YStack>Content</YStack>
 *   </SheetContent>
 * </Sheet>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Modal, Pressable, Dimensions } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import { X } from '@tamagui/lucide-icons'

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = createContext<SheetContextValue | null>(null)

const useSheetContext = () => {
  const context = useContext(SheetContext)
  if (!context) throw new Error('Sheet components must be used within Sheet')
  return context
}

export interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Sheet: React.FC<SheetProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

export const SheetTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild,
  children,
}) => {
  const { onOpenChange } = useSheetContext()

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
  name: 'SheetOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
})

const ContentContainer = styled(Animated.createAnimatedComponent(YStack), {
  name: 'SheetContent',
  backgroundColor: '$card',
  borderTopLeftRadius: '$xl',
  borderTopRightRadius: '$xl',
  padding: '$lg',
  paddingBottom: '$2xl',
  maxHeight: Dimensions.get('window').height * 0.9,
  width: '100%',
})

const Handle = styled(YStack, {
  name: 'SheetHandle',
  width: 40,
  height: 4,
  backgroundColor: '$border',
  borderRadius: '$full',
  alignSelf: 'center',
  marginBottom: '$md',
})

export const SheetContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, onOpenChange } = useSheetContext()

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => onOpenChange(false)}>
        <Overlay entering={FadeIn} exiting={FadeOut} />
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ContentContainer entering={SlideInDown} exiting={SlideOutDown}>
            <Handle />
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

export const SheetHeader = styled(YStack, {
  name: 'SheetHeader',
  space: '$xs',
  marginBottom: '$md',
})

export const SheetTitle = styled(Text, {
  name: 'SheetTitle',
  fontSize: 20,
  fontWeight: '600',
  color: '$text',
})

export const SheetDescription = styled(Text, {
  name: 'SheetDescription',
  fontSize: 14,
  color: '$muted',
  lineHeight: 20,
})
