import React, { useState } from 'react'
import { YStack, Text, ScrollView } from 'tamagui'
import { Card, Button, Input, Label, Alert } from '@life/ui'
import { useProfile, useUpdateCPF, useUpdateWhatsApp } from '../lib/hooks'
import { useToast } from '@life/ui'

export default function DadosPessoaisScreen() {
  const { data: profile } = useProfile()
  const updateCPF = useUpdateCPF()
  const updateWhatsApp = useUpdateWhatsApp()
  const { toast } = useToast()

  const [cpf, setCpf] = useState(profile?.cpf || '')
  const [whatsapp, setWhatsApp] = useState(profile?.whatsapp || '')

  async function handleSaveCPF() {
    try {
      await updateCPF.mutateAsync({ cpf })
      toast({ title: 'CPF atualizado!', variant: 'success' })
    } catch {
      toast({ title: 'Erro ao atualizar CPF', variant: 'danger' })
    }
  }

  async function handleSaveWhatsApp() {
    try {
      await updateWhatsApp.mutateAsync({ whatsapp })
      toast({ title: 'WhatsApp atualizado!', variant: 'success' })
    } catch {
      toast({ title: 'Erro ao atualizar WhatsApp', variant: 'danger' })
    }
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4">
        <Card>
          <Card.Header><Card.Title>CPF</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <Input value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" />
              <Button onPress={handleSaveCPF} loading={updateCPF.isPending}>Salvar CPF</Button>
            </YStack>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header><Card.Title>WhatsApp</Card.Title></Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <Input value={whatsapp} onChangeText={setWhatsApp} placeholder="+55 11 99999-9999" />
              <Button onPress={handleSaveWhatsApp} loading={updateWhatsApp.isPending}>Salvar WhatsApp</Button>
            </YStack>
          </Card.Content>
        </Card>
      </YStack>
    </ScrollView>
  )
}
