/**
 * Badge Component
 *
 * Small label for status, counts, or categories.
 *
 * @example
 * ```tsx
 * <Badge>Default</Badge>
 * <Badge variant="primary">Primary</Badge>
 * <Badge variant="success" size="lg">Success</Badge>
 * <Badge variant="outline" dot>With Dot</Badge>
 * ```
 */

import React from 'react'
import { XStack, XStackProps, Text, Circle, styled } from 'tamagui'

export interface BadgeProps extends XStackProps {
  /** Badge variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  /** Badge size */
  size?: 'sm' | 'md' | 'lg'
  /** Show dot indicator */
  dot?: boolean
  /** Dot color (overrides variant color) */
  dotColor?: string
}

const StyledBadge = styled(XStack, {
  name: 'Badge',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$full',
  paddingHorizontal: '$sm',

  variants: {
    variant: {
      default: {
        backgroundColor: '$surface',
        borderWidth: 1,
        borderColor: '$border',
      },
      primary: {
        backgroundColor: '$primary',
      },
      secondary: {
        backgroundColor: '$surface',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      danger: {
        backgroundColor: '$danger',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$border',
      },
    },
    size: {
      sm: {
        height: 20,
        paddingHorizontal: 6,
      },
      md: {
        height: 24,
        paddingHorizontal: 8,
      },
      lg: {
        height: 28,
        paddingHorizontal: 12,
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

const textColorMap = {
  default: '$text',
  primary: 'white',
  secondary: '$text',
  success: 'white',
  warning: 'white',
  danger: 'white',
  outline: '$text',
}

const textSizeMap = {
  sm: 10,
  md: 12,
  lg: 14,
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', dot, dotColor, ...props }, ref) => {
    return (
      <StyledBadge ref={ref} variant={variant} size={size} space="$xs" {...props}>
        {dot && (
          <Circle
            size={6}
            backgroundColor={dotColor || textColorMap[variant]}
          />
        )}
        <Text
          color={textColorMap[variant]}
          fontSize={textSizeMap[size]}
          fontWeight="500"
          lineHeight={textSizeMap[size] + 2}
        >
          {children}
        </Text>
      </StyledBadge>
    )
  }
)

Badge.displayName = 'Badge'
