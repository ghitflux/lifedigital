/**
 * Dashboard Stack Navigator
 */

import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import type { DashboardStackParamList } from '../types/navigation'
import { tokens } from '@life/tokens'

// Placeholder screens
import { YStack, Text } from '@life/ui'

const Stack = createStackNavigator<DashboardStackParamList>()

function DashboardScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Dashboard
      </Text>
    </YStack>
  )
}

function NovaSimulacaoScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Nova Simulação
      </Text>
    </YStack>
  )
}

function DetalhesSimulacaoScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Detalhes da Simulação
      </Text>
    </YStack>
  )
}

function HistoricoScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Histórico
      </Text>
    </YStack>
  )
}

export function DashboardStack() {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NovaSimulacao"
        component={NovaSimulacaoScreen}
        options={{ title: 'Nova Simulação' }}
      />
      <Stack.Screen
        name="DetalhesSimulacao"
        component={DetalhesSimulacaoScreen}
        options={{ title: 'Detalhes' }}
      />
      <Stack.Screen
        name="Historico"
        component={HistoricoScreen}
        options={{ title: 'Histórico' }}
      />
    </Stack.Navigator>
  )
}
