/**
 * StatCard Component - Statistics Card with Trend
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Revenue"
 *   value="R$ 45.231,89"
 *   change="+20.1%"
 *   trend="up"
 *   icon={<DollarSign />}
 * />
 * ```
 */

import React from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons'

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  description?: string
}

const CardContainer = styled(YStack, {
  name: 'StatCard',
  backgroundColor: '$card',
  borderRadius: '$lg',
  padding: '$lg',
  borderWidth: 1,
  borderColor: '$border',
  space: '$md',
})

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

const trendColorMap = {
  up: '$success',
  down: '$danger',
  neutral: '$muted',
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  description,
}) => {
  const TrendIcon = trendIconMap[trend]
  const trendColor = trendColorMap[trend]

  return (
    <CardContainer>
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack space="$xs" flex={1}>
          <Text fontSize={14} color="$muted" fontWeight="500">
            {title}
          </Text>
          <Text fontSize={32} fontWeight="700" color="$text">
            {value}
          </Text>
          {change && (
            <XStack space="$xs" alignItems="center">
              <TrendIcon size={16} color={trendColor} />
              <Text fontSize={14} color={trendColor} fontWeight="500">
                {change}
              </Text>
              {description && (
                <Text fontSize={14} color="$muted">
                  {description}
                </Text>
              )}
            </XStack>
          )}
        </YStack>
        {icon && (
          <YStack
            backgroundColor="$surface"
            padding="$sm"
            borderRadius="$md"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </YStack>
        )}
      </XStack>
    </CardContainer>
  )
}
