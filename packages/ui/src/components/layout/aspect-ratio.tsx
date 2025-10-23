/**
 * AspectRatio Component
 *
 * Maintains a consistent aspect ratio for content.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16/9}>
 *   <Image source={{uri: 'image.jpg'}} style={{width: '100%', height: '100%'}} />
 * </AspectRatio>
 * <AspectRatio ratio={1}>Square content</AspectRatio>
 * <AspectRatio ratio={4/3}>Classic ratio</AspectRatio>
 * ```
 */

import React from 'react'
import { YStack, YStackProps, styled } from 'tamagui'

export interface AspectRatioProps extends YStackProps {
  /** Aspect ratio (width / height) */
  ratio?: number
}

const Container = styled(YStack, {
  name: 'AspectRatio',
  position: 'relative',
  width: '100%',
})

const Content = styled(YStack, {
  name: 'AspectRatioContent',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, children, ...props }, ref) => {
    return (
      <Container ref={ref} {...props}>
        <YStack paddingBottom={`${100 / ratio}%`} />
        <Content>{children}</Content>
      </Container>
    )
  }
)

AspectRatio.displayName = 'AspectRatio'
