/**
 * Breadcrumb Component
 */

import React from 'react'
import { XStack, Text } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'

export interface BreadcrumbItem {
  label: string
  href?: string
  onPress?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight size={14} color="$muted" />,
}) => {
  return (
    <XStack space="$xs" alignItems="center" flexWrap="wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            <Text
              fontSize={14}
              color={isLast ? '$text' : '$muted'}
              fontWeight={isLast ? '500' : '400'}
              onPress={item.onPress}
              cursor={item.onPress ? 'pointer' : 'default'}
              textDecorationLine={item.onPress && !isLast ? 'underline' : 'none'}
            >
              {item.label}
            </Text>
            {!isLast && separator}
          </React.Fragment>
        )
      })}
    </XStack>
  )
}
