/**
 * Label Component
 *
 * A semantic label component for form inputs with proper accessibility support.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Label required>Username</Label>
 * <Label disabled>Disabled Field</Label>
 * ```
 */

import React from 'react'
import { Label as TamaguiLabel, LabelProps as TamaguiLabelProps, styled, Text } from 'tamagui'

export interface LabelProps extends TamaguiLabelProps {
  /** Mark field as required */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Size of the label */
  size?: 'sm' | 'md' | 'lg'
}

const StyledLabel = styled(TamaguiLabel, {
  name: 'Label',
  color: '$text',
  fontWeight: '500',
  cursor: 'pointer',

  variants: {
    size: {
      sm: {
        fontSize: 12,
      },
      md: {
        fontSize: 14,
      },
      lg: {
        fontSize: 16,
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, disabled, size = 'md', ...props }, ref) => {
    return (
      <StyledLabel
        ref={ref}
        size={size}
        disabled={disabled}
        accessible
        accessibilityRole="label"
        {...props}
      >
        {children}
        {required && (
          <Text color="$danger" marginLeft="$xs">
            *
          </Text>
        )}
      </StyledLabel>
    )
  }
)

Label.displayName = 'Label'
