import React from 'react'
import { YStack, Text, ScrollView } from 'tamagui'
import { Card, Switch, Label } from '@life/ui'

export default function SegurancaPrivacidadeScreen() {
  const [biometria, setBiometria] = React.useState(false)
  const [notificacoes, setNotificacoes] = React.useState(true)

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4">
        <Card>
          <Card.Header><Card.Title>Segurança</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <YStack gap="$2">
                <Label htmlFor="biometria">Autenticação Biométrica</Label>
                <Switch id="biometria" checked={biometria} onCheckedChange={setBiometria} />
              </YStack>
            </YStack>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header><Card.Title>Privacidade</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <YStack gap="$2">
                <Label htmlFor="notif">Notificações Push</Label>
                <Switch id="notif" checked={notificacoes} onCheckedChange={setNotificacoes} />
              </YStack>
            </YStack>
          </Card.Content>
        </Card>
      </YStack>
    </ScrollView>
  )
}
