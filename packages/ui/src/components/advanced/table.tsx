/**
 * Table Component - Data Table
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */

import React from 'react'
import { YStack, XStack, Text, styled } from 'tamagui'
import { ScrollView } from 'react-native'

const TableContainer = styled(YStack, {
  name: 'Table',
  borderRadius: '$lg',
  borderWidth: 1,
  borderColor: '$border',
  overflow: 'hidden',
})

export const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TableContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <YStack minWidth="100%">{children}</YStack>
      </ScrollView>
    </TableContainer>
  )
}

export const TableHeader = styled(YStack, {
  name: 'TableHeader',
  backgroundColor: '$surface',
  borderBottomWidth: 2,
  borderBottomColor: '$border',
})

export const TableBody = styled(YStack, {
  name: 'TableBody',
})

export const TableRow = styled(XStack, {
  name: 'TableRow',
  borderBottomWidth: 1,
  borderBottomColor: '$border',

  '$group-table-body': {
    hoverStyle: {
      backgroundColor: '$surface',
    },
  },
})

export const TableHead = styled(Text, {
  name: 'TableHead',
  flex: 1,
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  fontSize: 14,
  fontWeight: '600',
  color: '$text',
})

export const TableCell = styled(Text, {
  name: 'TableCell',
  flex: 1,
  paddingHorizontal: '$md',
  paddingVertical: '$sm',
  fontSize: 14,
  color: '$text',
})
