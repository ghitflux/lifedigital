import React from 'react'
import { FlatList } from 'react-native'
import { YStack, XStack, Text } from 'tamagui'
import { Card, Badge } from '@life/ui'

const mockNotifications = [
  { id: '1', title: 'Simulação Aprovada', message: 'Sua simulação de R$ 10.000 foi aprovada!', date: new Date(), read: false },
  { id: '2', title: 'Documento Analisado', message: 'Seu RG foi aprovado', date: new Date(Date.now() - 86400000), read: true },
]

export default function NotificacoesScreen() {
  return (
    <YStack flex={1} backgroundColor="$bg">
      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card marginBottom="$3">
            <Card.Content padding="$4">
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize={16} fontWeight="600">{item.title}</Text>
                  {!item.read && <Badge variant="primary">Nova</Badge>}
                </XStack>
                <Text fontSize={14} color="$muted">{item.message}</Text>
                <Text fontSize={12} color="$muted">{item.date.toLocaleDateString('pt-BR')}</Text>
              </YStack>
            </Card.Content>
          </Card>
        )}
      />
    </YStack>
  )
}
