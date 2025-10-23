/**
 * Avatar Component - User Avatar with Fallback
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://..." />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 */

import React, { useState } from 'react'
import { YStack, Text, styled, Image as TamaguiImage } from 'tamagui'
import { Image } from 'react-native'

export interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

const fontSizeMap = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
}

const AvatarContainer = styled(YStack, {
  name: 'Avatar',
  borderRadius: '$full',
  overflow: 'hidden',
  backgroundColor: '$surface',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    size: {
      sm: { width: sizeMap.sm, height: sizeMap.sm },
      md: { width: sizeMap.md, height: sizeMap.md },
      lg: { width: sizeMap.lg, height: sizeMap.lg },
      xl: { width: sizeMap.xl, height: sizeMap.xl },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
})

interface AvatarContextValue {
  imageLoaded: boolean
  setImageLoaded: (loaded: boolean) => void
  size: 'sm' | 'md' | 'lg' | 'xl'
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

export const Avatar: React.FC<AvatarProps> = ({ size = 'md', children }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded, size }}>
      <AvatarContainer size={size}>{children}</AvatarContainer>
    </AvatarContext.Provider>
  )
}

export const AvatarImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const context = React.useContext(AvatarContext)
  if (!context) throw new Error('AvatarImage must be used within Avatar')

  const { setImageLoaded, size } = context
  const imageSize = sizeMap[size]

  return (
    <Image
      source={{ uri: src }}
      style={{ width: imageSize, height: imageSize }}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageLoaded(false)}
      accessibilityLabel={alt}
    />
  )
}

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = React.useContext(AvatarContext)
  if (!context) throw new Error('AvatarFallback must be used within Avatar')

  const { imageLoaded, size } = context

  if (imageLoaded) return null

  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <Text fontSize={fontSizeMap[size]} fontWeight="600" color="$text">
        {children}
      </Text>
    </YStack>
  )
}
