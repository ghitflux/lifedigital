import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Alert as RNAlert } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { Button, Alert } from '@life/ui'
import { useLoginWithGoogle } from '../lib/hooks'
import type { AuthStackNavigationProp } from '../types/navigation'

// Necessário para fechar o browser após autenticação
WebBrowser.maybeCompleteAuthSession()

/**
 * Welcome Screen - Tela de Boas-Vindas
 *
 * @description
 * Primeira tela que o usuário vê ao abrir o app.
 * Apresenta o produto e oferece login via Google OAuth.
 *
 * Funcionalidades:
 * - Apresentação do Life Digital
 * - Login com Google OAuth (expo-auth-session)
 * - Navegação para Dashboard após login bem-sucedido
 */
export default function WelcomeScreen() {
  const navigation = useNavigation<AuthStackNavigationProp>()
  const loginWithGoogle = useLoginWithGoogle()
  const [error, setError] = useState<string | null>(null)

  // Configuração do Google OAuth
  const [_request, response, promptAsync] = Google.useAuthRequest({
    // TODO: Adicionar as credenciais reais do Google Cloud Console
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  })

  // Callback executado após resposta do Google
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response

      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken)
      }
    } else if (response?.type === 'error') {
      setError('Erro ao autenticar com Google. Tente novamente.')
    }
  }, [response])

  /**
   * Autentica com Google usando o ID token
   */
  async function handleGoogleLogin(idToken: string) {
    try {
      setError(null)
      await loginWithGoogle.mutateAsync({ idToken })

      // Login bem-sucedido -> navega para dashboard
      // O RootNavigator vai detectar que está autenticado e mostrar AppTabs
    } catch (err) {
      console.error('Erro ao fazer login:', err)
      setError('Erro ao fazer login. Tente novamente.')
    }
  }

  /**
   * Inicia o fluxo de autenticação Google
   */
  async function handlePressGoogleLogin() {
    try {
      await promptAsync()
    } catch (err) {
      console.error('Erro ao abrir Google OAuth:', err)
      RNAlert.alert('Erro', 'Não foi possível abrir o login do Google.')
    }
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack flex={1} padding="$6" gap="$6" justifyContent="center" minHeight="100%">
        {/* Logo e Título */}
        <YStack gap="$2" alignItems="center">
          <Text fontSize={48} fontWeight="bold" color="$primary" textAlign="center">
            Life Digital
          </Text>
          <Text fontSize={18} color="$text" textAlign="center">
            Crédito Consignado Simplificado
          </Text>
        </YStack>

        {/* Benefícios */}
        <YStack gap="$4" marginTop="$8">
          <BenefitItem
            title="Taxas Baixas"
            description="As menores taxas do mercado para crédito consignado"
          />
          <BenefitItem
            title="100% Digital"
            description="Simule e contrate totalmente online, sem burocracia"
          />
          <BenefitItem
            title="Seguro e Rápido"
            description="Processo seguro com aprovação em até 24 horas"
          />
        </YStack>

        {/* Erro */}
        {error && (
          <Alert variant="danger" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Botões de Ação */}
        <YStack gap="$3" marginTop="$8">
          {/* Login com Google */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handlePressGoogleLogin}
            loading={loginWithGoogle.isPending}
          >
            Entrar com Google
          </Button>

          {/* Informação adicional */}
          <Text fontSize={12} color="$muted" textAlign="center">
            Ao continuar, você concorda com nossos{'\n'}
            <Text color="$primary">Termos de Uso</Text> e{' '}
            <Text color="$primary">Política de Privacidade</Text>
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

/**
 * Componente: Item de Benefício
 */
interface BenefitItemProps {
  title: string
  description: string
}

function BenefitItem({ title, description }: BenefitItemProps) {
  return (
    <XStack gap="$3" alignItems="flex-start">
      {/* Ícone de check */}
      <YStack
        width={24}
        height={24}
        borderRadius="$full"
        backgroundColor="$primary"
        alignItems="center"
        justifyContent="center"
        marginTop="$1"
      >
        <Text color="white" fontSize={16} fontWeight="bold">
          ✓
        </Text>
      </YStack>

      {/* Texto */}
      <YStack flex={1} gap="$1">
        <Text fontSize={16} fontWeight="600" color="$text">
          {title}
        </Text>
        <Text fontSize={14} color="$muted">
          {description}
        </Text>
      </YStack>
    </XStack>
  )
}
