import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Card, Button, Avatar, Skeleton } from '@life/ui'
import { useUser, useLogout } from '../lib/hooks'
import type { PerfilStackNavigationProp } from '../types/navigation'

export default function PerfilScreen() {
  const navigation = useNavigation<PerfilStackNavigationProp>()
  const { data: user, isLoading } = useUser()
  const logout = useLogout()

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$bg" padding="$4" gap="$3">
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={200} />
      </YStack>
    )
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        <Card>
          <Card.Content>
            <YStack gap="$3" alignItems="center">
              <Avatar size="xl" src={user?.picture} fallback={user?.name?.[0] || 'U'} />
              <Text fontSize={24} fontWeight="bold">{user?.name}</Text>
              <Text fontSize={16} color="$muted">{user?.email}</Text>
            </YStack>
          </Card.Content>
        </Card>

        <YStack gap="$3">
          <Button variant="outline" onPress={() => navigation.navigate('DadosPessoais')}>Dados Pessoais</Button>
          <Button variant="outline" onPress={() => navigation.navigate('SegurancaPrivacidade')}>Segurança e Privacidade</Button>
          <Button variant="outline" onPress={() => navigation.navigate('Notificacoes')}>Notificações</Button>
          <Button variant="outline" onPress={() => navigation.navigate('AjudaSuporte')}>Ajuda e Suporte</Button>
          <Button variant="danger" onPress={() => logout.mutate()} loading={logout.isPending}>Sair</Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
