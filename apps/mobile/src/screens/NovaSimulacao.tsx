import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Alert as RNAlert } from 'react-native'
import { Card, Button, Input, Label, Select, Alert } from '@life/ui'
import { useCreateSimulation, useMargin, ProductType, SimulationStatus } from '../lib/hooks'
import { useToast } from '@life/ui'
import type { DashboardStackNavigationProp } from '../types/navigation'

/**
 * Nova Simulação Screen
 *
 * @description
 * Formulário para criar uma nova simulação de crédito consignado.
 * Permite ao usuário escolher:
 * - Tipo de produto
 * - Valor desejado
 * - Número de parcelas
 *
 * Após submissão, calcula automaticamente:
 * - Taxa de juros
 * - CET
 * - Valor da parcela
 * - Valor total a pagar
 */
export default function NovaSimulacaoScreen() {
  const navigation = useNavigation<DashboardStackNavigationProp>()
  const { toast } = useToast()
  const createSimulation = useCreateSimulation()
  const { data: margin } = useMargin()

  const [productType, setProductType] = useState<ProductType>(ProductType.CONSIGNADO)
  const [amount, setAmount] = useState('')
  const [installments, setInstallments] = useState('24')
  const [error, setError] = useState<string | null>(null)

  /**
   * Valida e formata o valor digitado
   */
  function handleAmountChange(value: string) {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '')
    setAmount(numericValue)
  }

  /**
   * Formata o valor para exibição
   */
  function formatCurrency(value: string): string {
    if (!value) return 'R$ 0,00'
    const numericValue = parseInt(value) / 100
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  /**
   * Valida os dados antes de submeter
   */
  function validateForm(): boolean {
    setError(null)

    const numericAmount = parseInt(amount) / 100

    if (!amount || numericAmount === 0) {
      setError('Digite um valor válido')
      return false
    }

    if (numericAmount < 100) {
      setError('Valor mínimo: R$ 100,00')
      return false
    }

    if (margin && numericAmount > margin.available) {
      setError(`Valor máximo disponível: R$ ${margin.available.toLocaleString('pt-BR')}`)
      return false
    }

    return true
  }

  /**
   * Submete o formulário
   */
  async function handleSubmit() {
    if (!validateForm()) return

    const numericAmount = parseInt(amount) / 100

    try {
      const simulation = await createSimulation.mutateAsync({
        productType,
        requestedAmount: numericAmount,
        installments: parseInt(installments),
      })

      if (simulation.status === SimulationStatus.APPROVED) {
        toast({
          title: 'Simulação Aprovada!',
          description: `Parcela de R$ ${simulation.monthlyPayment?.toLocaleString('pt-BR')}`,
          variant: 'success',
        })

        // Navega para detalhes da simulação
        navigation.navigate('DetalhesSimulacao', { id: simulation.id })
      } else if (simulation.status === SimulationStatus.REJECTED) {
        RNAlert.alert(
          'Simulação Rejeitada',
          simulation.rejectionReason || 'Não foi possível aprovar esta simulação.',
          [{ text: 'OK' }]
        )
      }
    } catch (err) {
      console.error('Erro ao criar simulação:', err)
      setError('Erro ao criar simulação. Tente novamente.')
    }
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        {/* Título */}
        <YStack gap="$2">
          <Text fontSize={28} fontWeight="bold" color="$text">
            Nova Simulação
          </Text>
          <Text fontSize={16} color="$muted">
            Simule seu crédito consignado
          </Text>
        </YStack>

        {/* Margem Disponível */}
        {margin && (
          <Alert variant="info">
            <Text fontSize={14} fontWeight="600">
              Margem disponível: R$ {margin.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </Alert>
        )}

        {/* Formulário */}
        <Card>
          <Card.Content>
            <YStack gap="$4">
              {/* Tipo de Produto */}
              <YStack gap="$2">
                <Label htmlFor="productType">Tipo de Produto</Label>
                <Select
                  id="productType"
                  value={productType}
                  onValueChange={(value) => setProductType(value as ProductType)}
                >
                  <Select.Item label="Crédito Consignado" value={ProductType.CONSIGNADO} />
                  <Select.Item label="Cartão Consignado" value={ProductType.CARTAO_CONSIGNADO} />
                  <Select.Item label="Refinanciamento" value={ProductType.REFIN} />
                  <Select.Item label="Portabilidade" value={ProductType.PORTABILIDADE} />
                </Select>
              </YStack>

              {/* Valor Desejado */}
              <YStack gap="$2">
                <Label htmlFor="amount">Valor Desejado</Label>
                <Input
                  id="amount"
                  placeholder="R$ 0,00"
                  value={formatCurrency(amount)}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                />
                <Text fontSize={12} color="$muted">
                  Digite o valor que deseja solicitar
                </Text>
              </YStack>

              {/* Número de Parcelas */}
              <YStack gap="$2">
                <Label htmlFor="installments">Número de Parcelas</Label>
                <Select
                  id="installments"
                  value={installments}
                  onValueChange={setInstallments}
                >
                  <Select.Item label="6 parcelas" value="6" />
                  <Select.Item label="12 parcelas" value="12" />
                  <Select.Item label="24 parcelas (recomendado)" value="24" />
                  <Select.Item label="36 parcelas" value="36" />
                  <Select.Item label="48 parcelas" value="48" />
                  <Select.Item label="60 parcelas" value="60" />
                  <Select.Item label="72 parcelas" value="72" />
                  <Select.Item label="84 parcelas" value="84" />
                </Select>
              </YStack>

              {/* Erro */}
              {error && (
                <Alert variant="danger" dismissible onDismiss={() => setError(null)}>
                  {error}
                </Alert>
              )}
            </YStack>
          </Card.Content>
        </Card>

        {/* Botões */}
        <XStack gap="$3">
          <YStack flex={1}>
            <Button
              variant="outline"
              fullWidth
              onPress={() => navigation.goBack()}
              disabled={createSimulation.isPending}
            >
              Cancelar
            </Button>
          </YStack>
          <YStack flex={1}>
            <Button
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              loading={createSimulation.isPending}
            >
              Simular
            </Button>
          </YStack>
        </XStack>

        {/* Informações Adicionais */}
        <Card>
          <Card.Header>
            <Card.Title>Informações Importantes</Card.Title>
          </Card.Header>
          <Card.Content>
            <YStack gap="$2">
              <InfoItem text="A simulação não compromete sua margem" />
              <InfoItem text="Taxas e valores são aproximados" />
              <InfoItem text="A aprovação final depende de análise" />
              <InfoItem text="Prazo de validade: 7 dias" />
            </YStack>
          </Card.Content>
        </Card>
      </YStack>
    </ScrollView>
  )
}

/**
 * Componente: Item de Informação
 */
function InfoItem({ text }: { text: string }) {
  return (
    <XStack gap="$2" alignItems="flex-start">
      <Text color="$primary" fontSize={16}>
        •
      </Text>
      <Text flex={1} fontSize={14} color="$muted">
        {text}
      </Text>
    </XStack>
  )
}
