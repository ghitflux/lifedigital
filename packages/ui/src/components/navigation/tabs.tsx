/**
 * Tabs Component
 */

import React, { useState } from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'

export interface Tab {
  id: string
  label: string
  content?: React.ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'default' | 'pills'
}

const TabsList = styled(XStack, {
  name: 'TabsList',
  borderBottomWidth: 1,
  borderBottomColor: '$border',
  space: '$sm',

  variants: {
    variant: {
      default: {},
      pills: {
        borderBottomWidth: 0,
        padding: '$xs',
        backgroundColor: '$surface',
        borderRadius: '$lg',
      },
    },
  } as const,
})

const TabTrigger = styled(YStack, {
  name: 'TabTrigger',
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  cursor: 'pointer',
  borderRadius: '$md',

  variants: {
    active: {
      true: {
        borderBottomWidth: 2,
        borderBottomColor: '$primary',
      },
    },
    variant: {
      pills: {
        backgroundColor: 'transparent',
        '$group-tab-active': {
          backgroundColor: '$card',
          borderBottomWidth: 0,
        },
      },
    },
  } as const,
})

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultValue,
  value: controlledValue,
  onValueChange,
  variant = 'default',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.id)
  const value = controlledValue ?? internalValue

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const activeTab = tabs.find((tab) => tab.id === value)

  return (
    <YStack flex={1}>
      <TabsList variant={variant}>
        {tabs.map((tab) => {
          const isActive = tab.id === value
          return (
            <TabTrigger
              key={tab.id}
              active={isActive}
              variant={variant}
              onPress={() => handleChange(tab.id)}
            >
              <Text
                fontWeight={isActive ? '600' : '400'}
                color={isActive ? '$primary' : '$text'}
                fontSize={14}
              >
                {tab.label}
              </Text>
            </TabTrigger>
          )
        })}
      </TabsList>

      {activeTab?.content && (
        <YStack flex={1} padding="$md">
          {activeTab.content}
        </YStack>
      )}
    </YStack>
  )
}
