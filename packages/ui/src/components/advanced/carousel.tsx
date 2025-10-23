/**
 * Carousel Component - Image/Content Carousel
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <CarouselItem><Image source={img1} /></CarouselItem>
 *   <CarouselItem><Image source={img2} /></CarouselItem>
 *   <CarouselItem><Image source={img3} /></CarouselItem>
 * </Carousel>
 * ```
 */

import React, { useState } from 'react'
import { YStack, XStack, styled } from 'tamagui'
import { ScrollView, Dimensions } from 'react-native'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export interface CarouselProps {
  children: React.ReactNode
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
}

const CarouselContainer = styled(YStack, {
  name: 'Carousel',
  width: '100%',
  position: 'relative',
})

const ArrowButton = styled(YStack, {
  name: 'CarouselArrow',
  position: 'absolute',
  top: '50%',
  width: 40,
  height: 40,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: '$full',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,

  hoverStyle: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
})

const DotsContainer = styled(XStack, {
  name: 'CarouselDots',
  position: 'absolute',
  bottom: 20,
  left: 0,
  right: 0,
  justifyContent: 'center',
  space: '$xs',
  zIndex: 10,
})

const Dot = styled(YStack, {
  name: 'CarouselDot',
  width: 8,
  height: 8,
  borderRadius: '$full',
  backgroundColor: 'rgba(255,255,255,0.5)',
  cursor: 'pointer',

  variants: {
    active: {
      true: {
        backgroundColor: 'white',
        width: 24,
      },
    },
  } as const,
})

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = React.useRef<ScrollView>(null)
  const items = React.Children.toArray(children)
  const width = Dimensions.get('window').width

  const scrollTo = (index: number) => {
    setCurrentIndex(index)
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true })
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    scrollTo(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
    scrollTo(newIndex)
  }

  React.useEffect(() => {
    if (autoPlay) {
      const timer = setInterval(goToNext, interval)
      return () => clearInterval(timer)
    }
  }, [autoPlay, currentIndex])

  return (
    <CarouselContainer>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
          setCurrentIndex(newIndex)
        }}
      >
        {items.map((item, index) => (
          <YStack key={index} width={width}>
            {item}
          </YStack>
        ))}
      </ScrollView>

      {showArrows && items.length > 1 && (
        <>
          <ArrowButton left={20} onPress={goToPrevious} transform={[{ translateY: -20 }]}>
            <ChevronLeft size={24} color="white" />
          </ArrowButton>
          <ArrowButton right={20} onPress={goToNext} transform={[{ translateY: -20 }]}>
            <ChevronRight size={24} color="white" />
          </ArrowButton>
        </>
      )}

      {showDots && items.length > 1 && (
        <DotsContainer>
          {items.map((_, index) => (
            <Dot key={index} active={index === currentIndex} onPress={() => scrollTo(index)} />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  )
}

export const CarouselItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <YStack flex={1}>{children}</YStack>
}
