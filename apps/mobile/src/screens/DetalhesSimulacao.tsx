import React from 'react'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Alert as RNAlert } from 'react-native'
import { Card, Button, Badge, Skeleton, Alert, Separator } from '@life/ui'
import { useSimulation, useApproveSimulation, useCancelSimulation, SimulationStatus } from '../lib/hooks'
import { useToast } from '@life/ui'
import type { DashboardStackParamList } from '../types/navigation'

type DetalhesSimulacaoRouteProp = RouteProp<DashboardStackParamList, 'DetalhesSimulacao'>

/**
 * Detalhes da Simulação Screen
 *
 * @description
 * Exibe todos os detalhes de uma simulação específica:
 * - Valor solicitado e aprovado
 * - Número de parcelas
 * - Taxa de juros e CET
 * - Valor da parcela
 * - Valor total a pagar
 * - Status da simulação
 * - Ações disponíveis (aceitar, cancelar)
 */
export default function DetalhesSimulacaoScreen() {
  const route = useRoute<DetalhesSimulacaoRouteProp>()
  const navigation = useNavigation()
  const { toast } = useToast()
  const { id } = route.params

  const { data: simulation, isLoading } = useSimulation(id)
  const approveSimulation = useApproveSimulation()
  const cancelSimulation = useCancelSimulation()

  /**
   * Aceita a simulação
   */
  async function handleApprove() {
    RNAlert.alert(
      'Confirmar Aceite',
      'Você deseja aceitar esta simulação e iniciar o processo de contratação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await approveSimulation.mutateAsync({ simulationId: id })
              toast({
                title: 'Simulação Aceita!',
                description: 'Processo de contratação iniciado',
                variant: 'success',
              })
            } catch (err) {
              toast({
                title: 'Erro',
                description: 'Não foi possível aceitar a simulação',
                variant: 'danger',
              })
            }
          },
        },
      ]
    )
  }

  /**
   * Cancela a simulação
   */
  async function handleCancel() {
    RNAlert.alert('Cancelar Simulação', 'Tem certeza que deseja cancelar esta simulação?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelSimulation.mutateAsync({ simulationId: id })
            toast({
              title: 'Simulação Cancelada',
              variant: 'success',
            })
            navigation.goBack()
          } catch (err) {
            toast({
              title: 'Erro',
              description: 'Não foi possível cancelar a simulação',
              variant: 'danger',
            })
          }
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <ScrollView flex={1} backgroundColor="$bg">
        <YStack padding="$4" gap="$4">
          <Skeleton width="100%" height={200} />
          <Skeleton width="100%" height={150} />
          <Skeleton width="100%" height={100} />
        </YStack>
      </ScrollView>
    )
  }

  if (!simulation) {
    return (
      <YStack flex={1} backgroundColor="$bg" padding="$4">
        <Alert variant="danger">Simulação não encontrada</Alert>
      </YStack>
    )
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        {/* Status */}
        <Card>
          <Card.Content>
            <YStack gap="$3" alignItems="center">
              <Badge
                variant={
                  simulation.status === SimulationStatus.APPROVED
                    ? 'success'
                    : simulation.status === SimulationStatus.REJECTED
                      ? 'danger'
                      : simulation.status === SimulationStatus.ACCEPTED
                        ? 'success'
                        : 'warning'
                }
                size="lg"
              >
                {simulation.status === SimulationStatus.APPROVED && 'Aprovada'}
                {simulation.status === SimulationStatus.REJECTED && 'Rejeitada'}
                {simulation.status === SimulationStatus.ACCEPTED && 'Aceita'}
                {simulation.status === SimulationStatus.PENDING && 'Pendente'}
                {simulation.status === SimulationStatus.CANCELLED && 'Cancelada'}
              </Badge>

              <Text fontSize={48} fontWeight="bold" color="$primary">
                R$ {simulation.approvedAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>

              <Text fontSize={16} color="$muted">
                {simulation.productType === 'consignado' && 'Crédito Consignado'}
                {simulation.productType === 'cartao_consignado' && 'Cartão Consignado'}
                {simulation.productType === 'refin' && 'Refinanciamento'}
                {simulation.productType === 'portabilidade' && 'Portabilidade'}
              </Text>
            </YStack>
          </Card.Content>
        </Card>

        {/* Detalhes da Parcela */}
        {simulation.status === SimulationStatus.APPROVED && (
          <Card>
            <Card.Header>
              <Card.Title>Detalhes do Financiamento</Card.Title>
            </Card.Header>
            <Card.Content>
              <YStack gap="$3">
                <DetailRow label="Valor da Parcela" value={`R$ ${simulation.monthlyPayment?.toLocaleString('pt-BR')}`} highlight />
                <Separator />
                <DetailRow label="Número de Parcelas" value={`${simulation.installments}x`} />
                <DetailRow label="Taxa de Juros" value={`${simulation.interestRate?.toFixed(2)}% a.m.`} />
                <DetailRow label="CET" value={`${simulation.cet?.toFixed(2)}% a.a.`} />
                <Separator />
                <DetailRow label="Valor Total" value={`R$ ${simulation.totalAmount?.toLocaleString('pt-BR')}`} />
              </YStack>
            </Card.Content>
          </Card>
        )}

        {/* Informações Adicionais */}
        <Card>
          <Card.Header>
            <Card.Title>Informações</Card.Title>
          </Card.Header>
          <Card.Content>
            <YStack gap="$2">
              <DetailRow
                label="Criado em"
                value={new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
              />
              {simulation.expiresAt && (
                <DetailRow
                  label="Válido até"
                  value={new Date(simulation.expiresAt).toLocaleDateString('pt-BR')}
                />
              )}
              {simulation.rejectionReason && (
                <YStack gap="$1">
                  <Text fontSize={14} fontWeight="600" color="$text">
                    Motivo da Rejeição
                  </Text>
                  <Text fontSize={14} color="$danger">
                    {simulation.rejectionReason}
                  </Text>
                </YStack>
              )}
            </YStack>
          </Card.Content>
        </Card>

        {/* Ações */}
        {simulation.status === SimulationStatus.APPROVED && (
          <YStack gap="$3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleApprove}
              loading={approveSimulation.isPending}
            >
              Aceitar Simulação
            </Button>
            <Button
              variant="outline"
              fullWidth
              onPress={handleCancel}
              loading={cancelSimulation.isPending}
            >
              Cancelar Simulação
            </Button>
          </YStack>
        )}

        {simulation.status === SimulationStatus.PENDING && (
          <Button variant="outline" fullWidth onPress={handleCancel} loading={cancelSimulation.isPending}>
            Cancelar Simulação
          </Button>
        )}
      </YStack>
    </ScrollView>
  )
}

/**
 * Componente: Linha de Detalhe
 */
interface DetailRowProps {
  label: string
  value: string
  highlight?: boolean
}

function DetailRow({ label, value, highlight }: DetailRowProps) {
  return (
    <XStack justifyContent="space-between" alignItems="center">
      <Text fontSize={14} color="$muted">
        {label}
      </Text>
      <Text fontSize={highlight ? 20 : 16} fontWeight={highlight ? 'bold' : '600'} color={highlight ? '$primary' : '$text'}>
        {value}
      </Text>
    </XStack>
  )
}
