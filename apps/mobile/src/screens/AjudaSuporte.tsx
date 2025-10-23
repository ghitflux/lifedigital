import React from 'react'
import { YStack, Text, ScrollView } from 'tamagui'
import { Card, Button } from '@life/ui'
import { Linking } from 'react-native'

export default function AjudaSuporteScreen() {
  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4">
        <Card>
          <Card.Header><Card.Title>Central de Ajuda</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <Button variant="outline" onPress={() => Linking.openURL('https://wa.me/5511999999999')}>WhatsApp</Button>
              <Button variant="outline" onPress={() => Linking.openURL('mailto:suporte@lifedigital.com.br')}>Email</Button>
              <Button variant="outline" onPress={() => Linking.openURL('tel:08005550000')}>Telefone: 0800 555 0000</Button>
            </YStack>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header><Card.Title>Perguntas Frequentes</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <FAQItem question="Como funciona o crédito consignado?" answer="O crédito consignado é descontado diretamente da folha de pagamento ou benefício." />
              <FAQItem question="Qual a taxa de juros?" answer="As taxas variam conforme o perfil e prazo escolhido." />
              <FAQItem question="Quanto tempo demora a aprovação?" answer="Em média 24 a 48 horas após envio da documentação." />
            </YStack>
          </Card.Content>
        </Card>
      </YStack>
    </ScrollView>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <YStack gap="$1">
      <Text fontSize={14} fontWeight="600">{question}</Text>
      <Text fontSize={14} color="$muted">{answer}</Text>
    </YStack>
  )
}
