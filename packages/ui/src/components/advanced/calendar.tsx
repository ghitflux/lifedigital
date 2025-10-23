/**
 * Calendar Component - Simple Date Picker
 *
 * @example
 * ```tsx
 * <Calendar
 *   selected={selectedDate}
 *   onSelect={setSelectedDate}
 *   minDate={new Date()}
 * />
 * ```
 */

import React, { useState } from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

const CalendarContainer = styled(YStack, {
  name: 'Calendar',
  backgroundColor: '$card',
  borderRadius: '$lg',
  borderWidth: 1,
  borderColor: '$border',
  padding: '$md',
  minWidth: 280,
})

const Header = styled(XStack, {
  name: 'CalendarHeader',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$md',
})

const NavButton = styled(YStack, {
  name: 'CalendarNav',
  padding: '$xs',
  borderRadius: '$sm',
  cursor: 'pointer',

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

const DaysGrid = styled(YStack, {
  name: 'CalendarGrid',
  space: '$xs',
})

const DayButton = styled(YStack, {
  name: 'CalendarDay',
  width: 36,
  height: 36,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$sm',
  cursor: 'pointer',

  variants: {
    selected: {
      true: {
        backgroundColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'not-allowed',
      },
    },
  } as const,

  hoverStyle: {
    backgroundColor: '$surface',
  },
})

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, minDate, maxDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  return (
    <CalendarContainer>
      <Header>
        <NavButton onPress={goToPreviousMonth}>
          <ChevronLeft size={20} color="$text" />
        </NavButton>
        <Text fontSize={16} fontWeight="600" color="$text">
          {MONTHS[month]} {year}
        </Text>
        <NavButton onPress={goToNextMonth}>
          <ChevronRight size={20} color="$text" />
        </NavButton>
      </Header>

      <DaysGrid>
        <XStack justifyContent="space-between" marginBottom="$xs">
          {DAYS.map((day, index) => (
            <Text key={index} fontSize={12} fontWeight="600" color="$muted" width={36} textAlign="center">
              {day}
            </Text>
          ))}
        </XStack>

        {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
          <XStack key={weekIndex} justifyContent="space-between">
            {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((date, dayIndex) => {
              if (!date) {
                return <YStack key={dayIndex} width={36} height={36} />
              }

              const isSelected = selected && date.toDateString() === selected.toDateString()
              const isDisabled = isDateDisabled(date)

              return (
                <DayButton
                  key={dayIndex}
                  selected={isSelected}
                  disabled={isDisabled}
                  onPress={() => !isDisabled && onSelect?.(date)}
                >
                  <Text fontSize={14} color={isSelected ? 'white' : '$text'}>
                    {date.getDate()}
                  </Text>
                </DayButton>
              )
            })}
          </XStack>
        ))}
      </DaysGrid>
    </CalendarContainer>
  )
}
