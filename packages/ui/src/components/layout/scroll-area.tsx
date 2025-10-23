/**
 * ScrollArea Component
 *
 * A scrollable container with customizable scrollbars.
 *
 * @example
 * ```tsx
 * <ScrollArea height={300}>
 *   <LongContent />
 * </ScrollArea>
 * <ScrollArea horizontal>
 *   <WideContent />
 * </ScrollArea>
 * ```
 */

import React from 'react'
import { ScrollView as TamaguiScrollView, ScrollViewProps as TamaguiScrollViewProps, styled } from 'tamagui'

export interface ScrollAreaProps extends TamaguiScrollViewProps {
  /** Enable horizontal scrolling */
  horizontal?: boolean
  /** Maximum height */
  maxHeight?: number | string
  /** Show scrollbar */
  showScrollbar?: boolean
}

const StyledScrollView = styled(TamaguiScrollView, {
  name: 'ScrollArea',
  backgroundColor: 'transparent',

  variants: {
    showScrollbar: {
      false: {
        // Hide scrollbar on web
        '$platform-web': {
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
    },
  } as const,

  defaultVariants: {
    showScrollbar: true,
  },
})

export const ScrollArea = React.forwardRef<any, ScrollAreaProps>(
  ({ children, horizontal, maxHeight, showScrollbar = true, ...props }, ref) => {
    return (
      <StyledScrollView
        ref={ref}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={horizontal && showScrollbar}
        showsVerticalScrollIndicator={!horizontal && showScrollbar}
        maxHeight={maxHeight}
        showScrollbar={showScrollbar}
        {...props}
      >
        {children}
      </StyledScrollView>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'
