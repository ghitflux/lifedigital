/**
 * MobileNav Component - Bottom Tab Navigation
 */

import React from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import { Platform } from 'react-native'

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  onPress: () => void
}

export interface MobileNavProps {
  items: NavItem[]
  activeId?: string
}

const NavContainer = styled(XStack, {
  name: 'MobileNav',
  backgroundColor: '$card',
  borderTopWidth: 1,
  borderTopColor: '$border',
  paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  paddingTop: 8,
  justifyContent: 'space-around',
  alignItems: 'center',
})

const NavItemContainer = styled(YStack, {
  name: 'NavItem',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$sm',
  cursor: 'pointer',
  space: 4,
})

export const MobileNav: React.FC<MobileNavProps> = ({ items, activeId }) => {
  return (
    <NavContainer>
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <NavItemContainer key={item.id} onPress={item.onPress}>
            <YStack opacity={isActive ? 1 : 0.6}>{item.icon}</YStack>
            <Text
              fontSize={11}
              fontWeight={isActive ? '600' : '400'}
              color={isActive ? '$primary' : '$muted'}
            >
              {item.label}
            </Text>
          </NavItemContainer>
        )
      })}
    </NavContainer>
  )
}
