import React, { useState } from 'react'
import { RefreshControl, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text } from 'tamagui'
import { Card, Badge, Skeleton, Tabs } from '@life/ui'
import { useSimulations, SimulationStatus } from '../lib/hooks'
import type { DashboardStackNavigationProp } from '../types/navigation'

/**
 * Histórico Screen
 *
 * @description
 * Exibe o histórico completo de simulações do usuário.
 * Permite filtrar por status (Todas, Pendentes, Aprovadas, Rejeitadas).
 */
export default function HistoricoScreen() {
  const navigation = useNavigation<DashboardStackNavigationProp>()
  const { data: simulations, isLoading, refetch } = useSimulations()
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('todas')

  /**
   * Pull to refresh
   */
  async function handleRefresh() {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  /**
   * Filtra simulações por tab ativa
   */
  const filteredSimulations = React.useMemo(() => {
    if (!simulations) return []

    switch (activeTab) {
      case 'pendentes':
        return simulations.filter((s) => s.status === SimulationStatus.PENDING)
      case 'aprovadas':
        return simulations.filter((s) => s.status === SimulationStatus.APPROVED || s.status === SimulationStatus.ACCEPTED)
      case 'rejeitadas':
        return simulations.filter((s) => s.status === SimulationStatus.REJECTED || s.status === SimulationStatus.CANCELLED)
      default:
        return simulations
    }
  }, [simulations, activeTab])

  /**
   * Renderiza item da lista
   */
  function renderItem({ item }: { item: typeof simulations[0] }) {
    return (
      <Card
        marginBottom="$3"
        pressable
        onPress={() => navigation.navigate('DetalhesSimulacao', { id: item.id })}
      >
        <Card.Content padding="$4">
          <YStack gap="$3">
            {/* Cabeçalho */}
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1">
                <Text fontSize={20} fontWeight="bold" color="$text">
                  R$ {item.approvedAmount?.toLocaleString('pt-BR') ?? item.requestedAmount.toLocaleString('pt-BR')}
                </Text>
                <Text fontSize={14} color="$muted">
                  {item.installments}x parcelas
                </Text>
              </YStack>

              <Badge
                variant={
                  item.status === SimulationStatus.APPROVED || item.status === SimulationStatus.ACCEPTED
                    ? 'success'
                    : item.status === SimulationStatus.REJECTED || item.status === SimulationStatus.CANCELLED
                      ? 'danger'
                      : 'warning'
                }
              >
                {item.status === SimulationStatus.APPROVED && 'Aprovada'}
                {item.status === SimulationStatus.REJECTED && 'Rejeitada'}
                {item.status === SimulationStatus.ACCEPTED && 'Aceita'}
                {item.status === SimulationStatus.PENDING && 'Pendente'}
                {item.status === SimulationStatus.CANCELLED && 'Cancelada'}
              </Badge>
            </XStack>

            {/* Detalhes */}
            {item.monthlyPayment && (
              <XStack justifyContent="space-between">
                <Text fontSize={14} color="$muted">
                  Parcela:
                </Text>
                <Text fontSize={14} fontWeight="600" color="$text">
                  R$ {item.monthlyPayment.toLocaleString('pt-BR')}
                </Text>
              </XStack>
            )}

            {/* Data */}
            <Text fontSize={12} color="$muted">
              {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </YStack>
        </Card.Content>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$bg" padding="$4" gap="$3">
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
        <Skeleton width="100%" height={120} />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$bg">
      {/* Filtros */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="todas">Todas</Tabs.Trigger>
          <Tabs.Trigger value="pendentes">Pendentes</Tabs.Trigger>
          <Tabs.Trigger value="aprovadas">Aprovadas</Tabs.Trigger>
          <Tabs.Trigger value="rejeitadas">Rejeitadas</Tabs.Trigger>
        </Tabs.List>
      </Tabs>

      {/* Lista */}
      <FlatList
        data={filteredSimulations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
            <Text fontSize={16} color="$muted" textAlign="center">
              Nenhuma simulação encontrada
            </Text>
          </YStack>
        }
      />
    </YStack>
  )
}
