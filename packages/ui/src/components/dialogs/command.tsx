/**
 * Command Component - Command Palette (Cmd+K style)
 *
 * @example
 * ```tsx
 * <Command open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandGroup heading="Actions">
 *       <CommandItem onSelect={() => {}}>New File</CommandItem>
 *       <CommandItem onSelect={() => {}}>Save</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */

import React, { createContext, useContext, useState } from 'react'
import { YStack, XStack, Text, Input, styled } from 'tamagui'
import { Modal, Pressable, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Search } from '@tamagui/lucide-icons'

interface CommandContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  search: string
  setSearch: (search: string) => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

const useCommandContext = () => {
  const context = useContext(CommandContext)
  if (!context) throw new Error('Command components must be used within Command')
  return context
}

export interface CommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Command: React.FC<CommandProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const open = controlledOpen ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <CommandContext.Provider value={{ open, onOpenChange: handleOpenChange, search, setSearch }}>
      {open && (
        <Modal transparent visible={open} animationType="none" onRequestClose={() => handleOpenChange(false)}>
          <Pressable
            style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 100, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => handleOpenChange(false)}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                {children}
              </Animated.View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </CommandContext.Provider>
  )
}

const InputContainer = styled(XStack, {
  name: 'CommandInput',
  borderBottomWidth: 1,
  borderBottomColor: '$border',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  space: '$sm',
  alignItems: 'center',
  backgroundColor: '$card',
  borderTopLeftRadius: '$lg',
  borderTopRightRadius: '$lg',
})

export const CommandInput: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { search, setSearch } = useCommandContext()

  return (
    <InputContainer>
      <Search size={20} color="$muted" />
      <Input
        flex={1}
        value={search}
        onChangeText={setSearch}
        placeholder={placeholder}
        borderWidth={0}
        backgroundColor="transparent"
        fontSize={16}
      />
    </InputContainer>
  )
}

const ListContainer = styled(YStack, {
  name: 'CommandList',
  backgroundColor: '$card',
  minWidth: 500,
  maxWidth: 600,
  maxHeight: 400,
  borderBottomLeftRadius: '$lg',
  borderBottomRightRadius: '$lg',
})

export const CommandList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ListContainer>
      <ScrollView style={{ maxHeight: 400 }}>{children}</ScrollView>
    </ListContainer>
  )
}

export const CommandGroup: React.FC<{ heading?: string; children: React.ReactNode }> = ({ heading, children }) => {
  return (
    <YStack paddingVertical="$xs">
      {heading && (
        <Text fontSize={12} fontWeight="600" color="$muted" paddingHorizontal="$md" paddingVertical="$xs">
          {heading}
        </Text>
      )}
      {children}
    </YStack>
  )
}

export interface CommandItemProps {
  onSelect?: () => void
  children: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
}

export const CommandItem = styled(XStack, {
  name: 'CommandItem',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  space: '$sm',
  alignItems: 'center',
  justifyContent: 'space-between',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})
