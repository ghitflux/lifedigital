/**
 * Card Component
 *
 * A container component with header, content, and footer sections.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content goes here</CardContent>
 *   <CardFooter>Footer content</CardFooter>
 * </Card>
 * ```
 */

import React from 'react'
import { Card as TamaguiCard, CardProps as TamaguiCardProps, YStack, XStack, Text, styled } from 'tamagui'

export interface CardProps extends TamaguiCardProps {
  /** Variant style */
  variant?: 'default' | 'elevated' | 'outlined'
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const StyledCard = styled(TamaguiCard, {
  name: 'Card',
  backgroundColor: '$card',
  borderRadius: '$lg',
  overflow: 'hidden',

  variants: {
    variant: {
      default: {
        backgroundColor: '$card',
      },
      elevated: {
        backgroundColor: '$card',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
      outlined: {
        backgroundColor: '$card',
        borderWidth: 1,
        borderColor: '$border',
      },
    },
    padding: {
      none: {
        padding: 0,
      },
      sm: {
        padding: '$sm',
      },
      md: {
        padding: '$md',
      },
      lg: {
        padding: '$lg',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, variant = 'default', padding = 'md', ...props }, ref) => {
  return (
    <StyledCard ref={ref} variant={variant} padding={padding} {...props}>
      {children}
    </StyledCard>
  )
})

Card.displayName = 'Card'

// Card Header
export interface CardHeaderProps extends TamaguiCardProps {
  divided?: boolean
}

export const CardHeader = styled(YStack, {
  name: 'CardHeader',
  padding: '$md',
  space: '$xs',

  variants: {
    divided: {
      true: {
        borderBottomWidth: 1,
        borderBottomColor: '$border',
      },
    },
  } as const,
})

// Card Title
export const CardTitle = styled(Text, {
  name: 'CardTitle',
  fontSize: 20,
  fontWeight: '600',
  color: '$text',
})

// Card Description
export const CardDescription = styled(Text, {
  name: 'CardDescription',
  fontSize: 14,
  color: '$muted',
  lineHeight: 20,
})

// Card Content
export const CardContent = styled(YStack, {
  name: 'CardContent',
  padding: '$md',
  flex: 1,
})

// Card Footer
export interface CardFooterProps extends TamaguiCardProps {
  divided?: boolean
  justify?: 'start' | 'center' | 'end' | 'space-between'
}

export const CardFooter = styled(XStack, {
  name: 'CardFooter',
  padding: '$md',
  space: '$sm',

  variants: {
    divided: {
      true: {
        borderTopWidth: 1,
        borderTopColor: '$border',
      },
    },
    justify: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      end: {
        justifyContent: 'flex-end',
      },
      'space-between': {
        justifyContent: 'space-between',
      },
    },
  } as const,

  defaultVariants: {
    justify: 'end',
  },
})
