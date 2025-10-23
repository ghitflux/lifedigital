/**
 * Button Component
 *
 * A versatile button component built on Tamagui with multiple variants and sizes.
 * Supports press states, loading states, icons, and accessibility features.
 *
 * @example
 * ```tsx
 * <Button>Default Button</Button>
 * <Button variant="primary" size="lg">Large Primary</Button>
 * <Button variant="outline" icon={<Plus />}>With Icon</Button>
 * <Button loading disabled>Loading...</Button>
 * ```
 */

import React from 'react'
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps, Spinner, styled } from 'tamagui'
import { tokens } from '@life/tokens'

export interface ButtonProps extends Omit<TamaguiButtonProps, 'variant'> {
  /** Visual variant of the button */
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Icon to display before text */
  icon?: React.ReactNode
  /** Icon to display after text */
  iconAfter?: React.ReactNode
  /** Show loading spinner */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
}

const StyledButton = styled(TamaguiButton, {
  name: 'Button',
  borderRadius: '$md',
  fontWeight: '600',
  cursor: 'pointer',
  pressStyle: { opacity: 0.8, scale: 0.98 },
  focusStyle: { borderColor: '$primary', borderWidth: 2 },

  variants: {
    variant: {
      default: {
        backgroundColor: '$card',
        color: '$text',
        borderWidth: 1,
        borderColor: '$border',
        hoverStyle: { backgroundColor: '$surface' },
      },
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        borderWidth: 0,
        hoverStyle: { opacity: 0.9 },
      },
      secondary: {
        backgroundColor: '$surface',
        color: '$text',
        borderWidth: 0,
        hoverStyle: { backgroundColor: '$card' },
      },
      outline: {
        backgroundColor: 'transparent',
        color: '$text',
        borderWidth: 1,
        borderColor: '$border',
        hoverStyle: { backgroundColor: '$card' },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$text',
        borderWidth: 0,
        hoverStyle: { backgroundColor: '$card' },
      },
      danger: {
        backgroundColor: '$danger',
        color: 'white',
        borderWidth: 0,
        hoverStyle: { opacity: 0.9 },
      },
      success: {
        backgroundColor: '$success',
        color: 'white',
        borderWidth: 0,
        hoverStyle: { opacity: 0.9 },
      },
    },
    size: {
      sm: {
        height: 32,
        paddingHorizontal: '$sm',
        fontSize: 14,
      },
      md: {
        height: 40,
        paddingHorizontal: '$md',
        fontSize: 16,
      },
      lg: {
        height: 48,
        paddingHorizontal: '$lg',
        fontSize: 18,
      },
    },
    fullWidth: {
      true: {
        width: '100%',
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
    variant: 'default',
    size: 'md',
  },
})

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'md', icon, iconAfter, loading, disabled, fullWidth, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        accessible
        accessibilityRole="button"
        {...props}
      >
        {loading && <Spinner size="small" marginRight="$xs" color="currentColor" />}
        {!loading && icon && <>{icon}</>}
        {children}
        {!loading && iconAfter && <>{iconAfter}</>}
      </StyledButton>
    )
  }
)

Button.displayName = 'Button'
