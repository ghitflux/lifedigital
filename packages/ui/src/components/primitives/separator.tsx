/**
 * Separator Component
 *
 * A visual divider to separate content sections.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator thickness={2} />
 * <Separator color="$primary" />
 * ```
 */

import React from 'react'
import { Separator as TamaguiSeparator, SeparatorProps as TamaguiSeparatorProps, styled } from 'tamagui'

export interface SeparatorProps extends TamaguiSeparatorProps {
  /** Orientation of the separator */
  orientation?: 'horizontal' | 'vertical'
  /** Thickness of the separator */
  thickness?: number
  /** Color of the separator */
  color?: string
}

const StyledSeparator = styled(TamaguiSeparator, {
  name: 'Separator',
  backgroundColor: '$border',

  variants: {
    orientation: {
      horizontal: {
        height: 1,
        width: '100%',
      },
      vertical: {
        width: 1,
        height: '100%',
      },
    },
  } as const,

  defaultVariants: {
    orientation: 'horizontal',
  },
})

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', thickness = 1, color, ...props }, ref) => {
    return (
      <StyledSeparator
        ref={ref}
        orientation={orientation}
        backgroundColor={color}
        height={orientation === 'horizontal' ? thickness : undefined}
        width={orientation === 'vertical' ? thickness : undefined}
        accessible
        accessibilityRole="separator"
        {...props}
      />
    )
  }
)

Separator.displayName = 'Separator'
