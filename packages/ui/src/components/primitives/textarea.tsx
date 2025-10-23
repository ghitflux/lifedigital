/**
 * Textarea Component
 *
 * Multi-line text input with character count, auto-resize, and error states.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Enter description" />
 * <Textarea rows={5} maxLength={500} showCount />
 * <Textarea error errorMessage="Too short" />
 * <Textarea autoResize minRows={3} maxRows={10} />
 * ```
 */

import React, { useState } from 'react'
import { TextArea as TamaguiTextArea, TextAreaProps as TamaguiTextAreaProps, YStack, Text, XStack, styled } from 'tamagui'

export interface TextareaProps extends TamaguiTextAreaProps {
  /** Size of the textarea */
  size?: 'sm' | 'md' | 'lg'
  /** Error state */
  error?: boolean
  /** Error message to display */
  errorMessage?: string
  /** Helper text */
  helperText?: string
  /** Show character count */
  showCount?: boolean
  /** Maximum length */
  maxLength?: number
  /** Auto resize based on content */
  autoResize?: boolean
  /** Minimum rows when auto-resizing */
  minRows?: number
  /** Maximum rows when auto-resizing */
  maxRows?: number
  /** Full width */
  fullWidth?: boolean
}

const StyledTextArea = styled(TamaguiTextArea, {
  name: 'Textarea',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: '$card',
  color: '$text',
  placeholderTextColor: '$muted',
  outlineStyle: 'none',
  fontFamily: '$body',

  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
  },

  variants: {
    size: {
      sm: {
        paddingHorizontal: '$sm',
        paddingVertical: '$xs',
        fontSize: 14,
      },
      md: {
        paddingHorizontal: '$md',
        paddingVertical: '$sm',
        fontSize: 16,
      },
      lg: {
        paddingHorizontal: '$lg',
        paddingVertical: '$md',
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      error,
      errorMessage,
      helperText,
      showCount,
      maxLength,
      autoResize,
      minRows = 3,
      maxRows = 10,
      fullWidth,
      disabled,
      value,
      defaultValue,
      onChangeText,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      (value?.toString() || defaultValue?.toString() || '').length
    )
    const hasError = error || !!errorMessage

    const handleChange = (text: string) => {
      setCharCount(text.length)
      onChangeText?.(text)
    }

    return (
      <YStack space="$xs" flex={fullWidth ? 1 : undefined}>
        <StyledTextArea
          ref={ref}
          size={size}
          error={hasError}
          disabled={disabled}
          fullWidth={fullWidth}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChangeText={handleChange}
          rows={minRows}
          accessible
          accessibilityRole="text"
          {...props}
        />

        <XStack justifyContent="space-between" paddingHorizontal="$xs">
          {(errorMessage || helperText) && (
            <Text fontSize={12} color={hasError ? '$danger' : '$muted'} flex={1}>
              {errorMessage || helperText}
            </Text>
          )}

          {showCount && maxLength && (
            <Text
              fontSize={12}
              color={charCount >= maxLength ? '$danger' : '$muted'}
              marginLeft="auto"
            >
              {charCount} / {maxLength}
            </Text>
          )}
        </XStack>
      </YStack>
    )
  }
)

Textarea.displayName = 'Textarea'
