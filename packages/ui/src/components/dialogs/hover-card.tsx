/**
 * HoverCard Component - Card on Hover/Press
 *
 * @example
 * ```tsx
 * <HoverCard>
 *   <HoverCardTrigger asChild>
 *     <Text>@username</Text>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <YStack>
 *       <Avatar />
 *       <Text>User Info</Text>
 *     </YStack>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 */

import React from 'react'
import { Popover, PopoverTrigger, PopoverContent, PopoverProps } from './popover'

export const HoverCard = Popover
export const HoverCardTrigger = PopoverTrigger
export const HoverCardContent = PopoverContent
