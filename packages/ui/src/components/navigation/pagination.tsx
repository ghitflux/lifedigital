/**
 * Pagination Component
 */

import React from 'react'
import { XStack, Text, styled } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showEdges?: boolean
}

const PageButton = styled(XStack, {
  name: 'PageButton',
  width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$md',
  cursor: 'pointer',
  backgroundColor: 'transparent',

  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showEdges = true,
}) => {
  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)

    if (showEdges && totalPages > 1) range.push(1)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < totalPages - 1) range.push('...')
    if (showEdges && totalPages > 1) range.push(totalPages)

    return range
  }

  return (
    <XStack space="$xs" alignItems="center">
      <PageButton disabled={!canGoPrev} onPress={() => canGoPrev && onPageChange(currentPage - 1)}>
        <ChevronLeft size={16} color="$text" />
      </PageButton>

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <Text key={`ellipsis-${index}`} color="$muted" paddingHorizontal="$xs">
              ...
            </Text>
          )
        }
        const pageNum = page as number
        const isActive = pageNum === currentPage
        return (
          <PageButton key={pageNum} active={isActive} onPress={() => onPageChange(pageNum)}>
            <Text fontSize={14} fontWeight={isActive ? '600' : '400'} color={isActive ? 'white' : '$text'}>
              {pageNum}
            </Text>
          </PageButton>
        )
      })}

      <PageButton disabled={!canGoNext} onPress={() => canGoNext && onPageChange(currentPage + 1)}>
        <ChevronRight size={16} color="$text" />
      </PageButton>
    </XStack>
  )
}
