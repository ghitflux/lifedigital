/**
 * Perfil Stack Navigator
 */

import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import type { PerfilStackParamList } from '../types/navigation'
import { tokens } from '@life/tokens'

// Placeholder screens
import { YStack, Text } from '@life/ui'

const Stack = createStackNavigator<PerfilStackParamList>()

function PerfilScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Perfil
      </Text>
    </YStack>
  )
}

function DadosPessoaisScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Dados Pessoais
      </Text>
    </YStack>
  )
}

function SegurancaPrivacidadeScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Segurança e Privacidade
      </Text>
    </YStack>
  )
}

function NotificacoesScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Notificações
      </Text>
    </YStack>
  )
}

function AjudaSuporteScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Ajuda e Suporte
      </Text>
    </YStack>
  )
}

export function PerfilStack() {
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
        name="Perfil"
        component={PerfilScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DadosPessoais"
        component={DadosPessoaisScreen}
        options={{ title: 'Dados Pessoais' }}
      />
      <Stack.Screen
        name="SegurancaPrivacidade"
        component={SegurancaPrivacidadeScreen}
        options={{ title: 'Segurança e Privacidade' }}
      />
      <Stack.Screen
        name="Notificacoes"
        component={NotificacoesScreen}
        options={{ title: 'Notificações' }}
      />
      <Stack.Screen
        name="AjudaSuporte"
        component={AjudaSuporteScreen}
        options={{ title: 'Ajuda e Suporte' }}
      />
    </Stack.Navigator>
  )
}
