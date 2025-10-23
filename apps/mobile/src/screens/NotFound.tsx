import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { YStack, Text } from 'tamagui'
import { Button } from '@life/ui'

/**
 * NotFound Screen - 404
 *
 * @description
 * Tela exibida quando o usuário tenta acessar uma rota inexistente.
 */
export default function NotFoundScreen() {
  const navigation = useNavigation()

  return (
    <YStack flex={1} backgroundColor="$bg" alignItems="center" justifyContent="center" padding="$6" gap="$4">
      {/* Ícone 404 */}
      <Text fontSize={72} fontWeight="bold" color="$muted">
        404
      </Text>

      {/* Título */}
      <Text fontSize={24} fontWeight="bold" color="$text" textAlign="center">
        Página Não Encontrada
      </Text>

      {/* Descrição */}
      <Text fontSize={16} color="$muted" textAlign="center">
        A página que você está procurando não existe ou foi removida.
      </Text>

      {/* Botão */}
      <Button variant="primary" size="lg" onPress={() => navigation.navigate('AppTabs' as never)}>
        Voltar ao Início
      </Button>
    </YStack>
  )
}
