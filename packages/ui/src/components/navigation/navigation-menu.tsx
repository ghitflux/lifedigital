/**
 * NavigationMenu Component - Dropdown Navigation
 */

import React, { useState } from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'

export interface MenuItem {
  label: string
  href?: string
  onPress?: () => void
  children?: MenuItem[]
}

export interface NavigationMenuProps {
  items: MenuItem[]
}

const MenuTrigger = styled(XStack, {
  name: 'MenuTrigger',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  borderRadius: '$md',
  space: '$xs',
  alignItems: 'center',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

const SubMenu = styled(YStack, {
  name: 'SubMenu',
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: '$card',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  marginTop: '$xs',
  minWidth: 180,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
  zIndex: 1000,
})

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <XStack space="$xs">
      {items.map((item, index) => (
        <YStack key={index} position="relative">
          <MenuTrigger
            onPress={() => {
              if (item.children) {
                setOpenIndex(openIndex === index ? null : index)
              } else {
                item.onPress?.()
              }
            }}
          >
            <Text fontSize={14} fontWeight="500" color="$text">
              {item.label}
            </Text>
            {item.children && <ChevronDown size={14} color="$text" />}
          </MenuTrigger>

          {item.children && openIndex === index && (
            <SubMenu>
              {item.children.map((child, childIndex) => (
                <YStack
                  key={childIndex}
                  paddingHorizontal="$md"
                  paddingVertical="$sm"
                  cursor="pointer"
                  hoverStyle={{ backgroundColor: '$surface' }}
                  onPress={() => {
                    child.onPress?.()
                    setOpenIndex(null)
                  }}
                >
                  <Text fontSize={14} color="$text">
                    {child.label}
                  </Text>
                </YStack>
              ))}
            </SubMenu>
          )}
        </YStack>
      ))}
    </XStack>
  )
}
