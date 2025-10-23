/**
 * Sidebar Component - Side Navigation
 */

import React from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  onPress?: () => void
}

export interface SidebarProps {
  items: SidebarItem[]
  activeId?: string
  width?: number
  collapsible?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const SidebarContainer = styled(YStack, {
  name: 'Sidebar',
  backgroundColor: '$card',
  borderRightWidth: 1,
  borderRightColor: '$border',
  paddingVertical: '$md',
  height: '100%',
})

const SidebarItemContainer = styled(XStack, {
  name: 'SidebarItem',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  space: '$sm',
  alignItems: 'center',

  variants: {
    active: {
      true: {
        backgroundColor: '$surface',
        borderLeftWidth: 3,
        borderLeftColor: '$primary',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeId,
  width = 240,
  collapsed = false,
}) => {
  return (
    <SidebarContainer width={collapsed ? 60 : width}>
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <SidebarItemContainer key={item.id} active={isActive} onPress={item.onPress}>
            {item.icon && <YStack opacity={isActive ? 1 : 0.7}>{item.icon}</YStack>}
            {!collapsed && (
              <Text
                fontSize={14}
                fontWeight={isActive ? '600' : '400'}
                color={isActive ? '$primary' : '$text'}
              >
                {item.label}
              </Text>
            )}
          </SidebarItemContainer>
        )
      })}
    </SidebarContainer>
  )
}
