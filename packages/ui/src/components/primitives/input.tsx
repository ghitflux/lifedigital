/**
 * Input Component
 *
 * A flexible text input component with support for icons, error states, and various sizes.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter your name" />
 * <Input type="email" leftIcon={<Mail />} />
 * <Input error errorMessage="Invalid email" />
 * <Input disabled value="Read only" />
 * ```
 */

import React from 'react'
import { Input as TamaguiInput, InputProps as TamaguiInputProps, XStack, YStack, Text, styled } from 'tamagui'

export interface InputProps extends TamaguiInputProps {
  /** Size of the input */
  size?: 'sm' | 'md' | 'lg'
  /** Icon to display on the left */
  leftIcon?: React.ReactNode
  /** Icon to display on the right */
  rightIcon?: React.ReactNode
  /** Error state */
  error?: boolean
  /** Error message to display */
  errorMessage?: string
  /** Helper text */
  helperText?: string
  /** Full width input */
  fullWidth?: boolean
}

const StyledInput = styled(TamaguiInput, {
  name: 'Input',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: '$card',
  color: '$text',
  placeholderTextColor: '$muted',
  outlineStyle: 'none',

  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
  },

  variants: {
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
    error: {
      true: {
        borderColor: '$danger',
        focusStyle: {
          borderColor: '$danger',
        },
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', leftIcon, rightIcon, error, errorMessage, helperText, fullWidth, disabled, ...props }, ref) => {
    const hasError = error || !!errorMessage

    return (
      <YStack space="$xs" flex={fullWidth ? 1 : undefined}>
        <XStack
          alignItems="center"
          position="relative"
          width={fullWidth ? '100%' : undefined}
        >
          {leftIcon && (
            <XStack position="absolute" left="$sm" zIndex={1} pointerEvents="none">
              {leftIcon}
            </XStack>
          )}

          <StyledInput
            ref={ref}
            size={size}
            error={hasError}
            disabled={disabled}
            fullWidth={fullWidth}
            paddingLeft={leftIcon ? '$xl' : undefined}
            paddingRight={rightIcon ? '$xl' : undefined}
            accessible
            accessibilityRole="text"
            {...props}
          />

          {rightIcon && (
            <XStack position="absolute" right="$sm" zIndex={1} pointerEvents="none">
              {rightIcon}
            </XStack>
          )}
        </XStack>

        {(errorMessage || helperText) && (
          <Text
            fontSize={12}
            color={hasError ? '$danger' : '$muted'}
            paddingHorizontal="$xs"
          >
            {errorMessage || helperText}
          </Text>
        )}
      </YStack>
    )
  }
)

Input.displayName = 'Input'
