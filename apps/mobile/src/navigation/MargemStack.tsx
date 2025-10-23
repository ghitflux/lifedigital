/**
 * Margem Stack Navigator
 */

import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import type { MargemStackParamList } from '../types/navigation'
import { tokens } from '@life/tokens'

// Placeholder screen
import { YStack, Text } from '@life/ui'

const Stack = createStackNavigator<MargemStackParamList>()

function DetalhesMargemScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Detalhes da Margem
      </Text>
    </YStack>
  )
}

export function MargemStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.colors.card,
          borderBottomColor: tokens.colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: tokens.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="DetalhesMargem"
        component={DetalhesMargemScreen}
        options={{ title: 'Margem Disponível' }}
      />
    </Stack.Navigator>
  )
}
