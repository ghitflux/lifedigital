/**
 * Menubar Component - Top Menu Bar
 */

import React from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'

export interface MenubarItem {
  label: string
  icon?: React.ReactNode
  onPress?: () => void
  items?: Array<{
    label: string
    onPress: () => void
    icon?: React.ReactNode
    shortcut?: string
  }>
}

export interface MenubarProps {
  items: MenubarItem[]
}

const MenubarContainer = styled(XStack, {
  name: 'Menubar',
  backgroundColor: '$card',
  borderBottomWidth: 1,
  borderBottomColor: '$border',
  paddingHorizontal: '$md',
  paddingVertical: '$xs',
  alignItems: 'center',
  space: '$xs',
})

const MenubarButton = styled(XStack, {
  name: 'MenubarButton',
  paddingHorizontal: '$sm',
  paddingVertical: '$xs',
  borderRadius: '$sm',
  cursor: 'pointer',
  space: '$xs',
  alignItems: 'center',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const Menubar: React.FC<MenubarProps> = ({ items }) => {
  return (
    <MenubarContainer>
      {items.map((item, index) => (
        <MenubarButton key={index} onPress={item.onPress}>
          {item.icon}
          <Text fontSize={14} fontWeight="500" color="$text">
            {item.label}
          </Text>
        </MenubarButton>
      ))}
    </MenubarContainer>
  )
}
