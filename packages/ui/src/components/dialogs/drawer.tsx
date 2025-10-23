/**
 * Drawer Component - Side Drawer
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onOpenChange={setIsOpen} side="left">
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Menu</DrawerTitle>
 *     </DrawerHeader>
 *     <YStack>Items</YStack>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { Modal, Pressable, Dimensions } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated'
import { X } from '@tamagui/lucide-icons'

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: 'left' | 'right'
}

const DrawerContext = createContext<DrawerContextValue | null>(null)

const useDrawerContext = () => {
  const context = useContext(DrawerContext)
  if (!context) throw new Error('Drawer components must be used within Drawer')
  return context
}

export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'left' | 'right'
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({
  open: controlledOpen,
  onOpenChange,
  side = 'left',
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange, side }}>
      {children}
    </DrawerContext.Provider>
  )
}

const Overlay = styled(Animated.View, {
  name: 'DrawerOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
})

const ContentContainer = styled(Animated.createAnimatedComponent(YStack), {
  name: 'DrawerContent',
  backgroundColor: '$card',
  padding: '$lg',
  height: '100%',
  maxWidth: Dimensions.get('window').width * 0.85,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
})

export const DrawerContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open, onOpenChange, side } = useDrawerContext()

  const entering = side === 'left' ? SlideInLeft : SlideInRight
  const exiting = side === 'left' ? SlideOutLeft : SlideOutRight

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={() => onOpenChange(false)}>
      <Pressable
        style={{ flex: 1, flexDirection: 'row', justifyContent: side === 'left' ? 'flex-start' : 'flex-end' }}
        onPress={() => onOpenChange(false)}
      >
        <Overlay entering={FadeIn} exiting={FadeOut} />
        <Pressable onPress={(e) => e.stopPropagation()}>
          <ContentContainer entering={entering} exiting={exiting}>
            <XStack justifyContent="flex-end" marginBottom="$md">
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

export const DrawerHeader = styled(YStack, {
  name: 'DrawerHeader',
  space: '$xs',
  marginBottom: '$lg',
})

export const DrawerTitle = styled(Text, {
  name: 'DrawerTitle',
  fontSize: 24,
  fontWeight: '600',
  color: '$text',
})
