/**
 * Chart Component - Simple Bar/Line Chart
 *
 * @example
 * ```tsx
 * <Chart
 *   data={[
 *     { label: 'Jan', value: 100 },
 *     { label: 'Feb', value: 150 },
 *     { label: 'Mar', value: 120 },
 *   ]}
 *   type="bar"
 *   height={200}
 * />
 * ```
 */

import React from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartProps {
  data: ChartDataPoint[]
  type?: 'bar' | 'line'
  height?: number
  showValues?: boolean
  showLabels?: boolean
}

const ChartContainer = styled(YStack, {
  name: 'Chart',
  backgroundColor: '$card',
  borderRadius: '$lg',
  padding: '$md',
})

const Bar = styled(YStack, {
  name: 'ChartBar',
  backgroundColor: '$primary',
  borderRadius: '$sm',
  justifyContent: 'flex-end',
  alignItems: 'center',
})

export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'bar',
  height = 200,
  showValues = true,
  showLabels = true,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value))

  if (type === 'bar') {
    return (
      <ChartContainer>
        <XStack height={height} alignItems="flex-end" justifyContent="space-around" space="$sm">
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * height
            return (
              <YStack key={index} flex={1} alignItems="center" space="$xs">
                <Bar
                  height={barHeight}
                  backgroundColor={point.color || '$primary'}
                  width="100%"
                >
                  {showValues && (
                    <Text fontSize={12} fontWeight="600" color="white" marginBottom="$xs">
                      {point.value}
                    </Text>
                  )}
                </Bar>
                {showLabels && (
                  <Text fontSize={12} color="$muted">
                    {point.label}
                  </Text>
                )}
              </YStack>
            )
          })}
        </XStack>
      </ChartContainer>
    )
  }

  // Line chart - simplified SVG version
  return (
    <ChartContainer>
      <Text fontSize={14} color="$muted">
        Line chart (simplified implementation)
      </Text>
      <XStack height={height} alignItems="center" justifyContent="space-around">
        {data.map((point, index) => (
          <YStack key={index} alignItems="center" space="$xs">
            <Text fontSize={12} fontWeight="600" color="$primary">
              {point.value}
            </Text>
            <Text fontSize={12} color="$muted">
              {point.label}
            </Text>
          </YStack>
        ))}
      </XStack>
    </ChartContainer>
  )
}
