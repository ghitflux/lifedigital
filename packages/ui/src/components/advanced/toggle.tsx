/**
 * Toggle Component - Toggle Button
 *
 * @example
 * ```tsx
 * <Toggle pressed={pressed} onPressedChange={setPressed}>
 *   <Bold size={20} />
 * </Toggle>
 * ```
 */

import React from 'react'
import { YStack, styled } from 'tamagui'

export interface ToggleProps {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  children: React.ReactNode
  disabled?: boolean
}

const ToggleButton = styled(YStack, {
  name: 'Toggle',
  paddingHorizontal: '$sm',
  paddingVertical: '$sm',
  borderRadius: '$md',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  minWidth: 40,
  minHeight: 40,

  variants: {
    pressed: {
      true: {
        backgroundColor: '$surface',
        borderColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const Toggle = React.forwardRef<HTMLDivElement, ToggleProps>(
  ({ pressed, onPressedChange, children, disabled }, ref) => {
    return (
      <ToggleButton
        ref={ref}
        pressed={pressed}
        disabled={disabled}
        onPress={() => !disabled && onPressedChange?.(!pressed)}
      >
        {children}
      </ToggleButton>
    )
  }
)

Toggle.displayName = 'Toggle'
