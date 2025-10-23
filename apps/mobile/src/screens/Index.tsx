import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { YStack, Text } from 'tamagui'
import { useAuthStore } from '../stores/authStore'
import type { RootStackNavigationProp } from '../types/navigation'

/**
 * Index Screen - Splash Screen e Redirecionamento
 *
 * @description
 * Tela inicial que:
 * 1. Exibe um splash screen com logo e loading
 * 2. Verifica se o usuário está autenticado
 * 3. Redireciona para Dashboard (autenticado) ou Welcome (não autenticado)
 *
 * Esta tela é exibida por ~1-2 segundos enquanto o app inicializa.
 */
export default function IndexScreen() {
  const navigation = useNavigation<RootStackNavigationProp>()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Simula um pequeno delay para splash screen
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Usuário autenticado -> vai para dashboard
        navigation.replace('AppTabs')
      } else {
        // Usuário não autenticado -> vai para welcome
        navigation.replace('Welcome')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [isAuthenticated, navigation])

  return (
    <YStack flex={1} backgroundColor="$bg" alignItems="center" justifyContent="center" gap="$4">
      {/* Logo */}
      <Text fontSize={48} fontWeight="bold" color="$primary">
        Life Digital
      </Text>

      {/* Subtitle */}
      <Text fontSize={16} color="$muted">
        Crédito Consignado
      </Text>

      {/* Loading indicator */}
      <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 32 }} />
    </YStack>
  )
}
