/**
 * Auth Stack Navigator
 *
 * Handles authentication flow (Welcome, Login)
 */

import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import type { AuthStackParamList } from '../types/navigation'

// Screens (placeholders for now)
import { YStack, Text, Button } from '@life/ui'
import { useNavigation } from '@react-navigation/native'

const Stack = createStackNavigator<AuthStackParamList>()

// Placeholder screens
function WelcomeScreen() {
  const navigation = useNavigation()
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$bg" padding="$lg">
      <Text fontSize={32} fontWeight="700" color="$text" marginBottom="$md">
        Bem-vindo ao Life Digital
      </Text>
      <Text fontSize={16} color="$muted" textAlign="center" marginBottom="$2xl">
        Crédito consignado simples e rápido
      </Text>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={() => navigation.navigate('Login' as never)}
      >
        Começar
      </Button>
    </YStack>
  )
}

function LoginScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$bg" padding="$lg">
      <Text fontSize={24} fontWeight="600" color="$text" marginBottom="$xl">
        Entrar
      </Text>
      <Button variant="outline" fullWidth>
        Entrar com Google
      </Button>
    </YStack>
  )
}

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}
