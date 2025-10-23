/**
 * Documentos Stack Navigator
 */

import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import type { DocumentosStackParamList } from '../types/navigation'
import { tokens } from '@life/tokens'

// Placeholder screens
import { YStack, Text } from '@life/ui'

const Stack = createStackNavigator<DocumentosStackParamList>()

function MeusDocumentosScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Meus Documentos
      </Text>
    </YStack>
  )
}

function EnviarDocumentoScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text">
        Enviar Documento
      </Text>
    </YStack>
  )
}

export function DocumentosStack() {
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
        name="MeusDocumentos"
        component={MeusDocumentosScreen}
        options={{ title: 'Documentos' }}
      />
      <Stack.Screen
        name="EnviarDocumento"
        component={EnviarDocumentoScreen}
        options={{ title: 'Enviar Documento' }}
      />
    </Stack.Navigator>
  )
}
