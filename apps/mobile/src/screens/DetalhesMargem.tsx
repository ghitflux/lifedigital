import React, { useState } from 'react'
import { RefreshControl } from 'react-native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Card, Skeleton, Chart, StatCard } from '@life/ui'
import { useMargin, useMarginHistory, useMarginStatus } from '../lib/hooks'

/**
 * Detalhes da Margem Screen
 *
 * @description
 * Exibe informações detalhadas sobre a margem consignável:
 * - Margem total, usada e disponível
 * - Porcentagem de utilização
 * - Status (saudável, atenção, crítico)
 * - Histórico dos últimos 12 meses (gráfico)
 */
export default function DetalhesMargemScreen() {
  const { data: margin, isLoading: marginLoading, refetch: refetchMargin } = useMargin()
  const { data: history, isLoading: historyLoading, refetch: refetchHistory } = useMarginHistory()
  const { status, color, message, percentage } = useMarginStatus()
  const [refreshing, setRefreshing] = useState(false)

  /**
   * Pull to refresh
   */
  async function handleRefresh() {
    setRefreshing(true)
    await Promise.all([refetchMargin(), refetchHistory()])
    setRefreshing(false)
  }

  /**
   * Prepara dados para o gráfico
   */
  const chartData = React.useMemo(() => {
    if (!history) return []

    return history.map((item) => ({
      label: `${item.month}/${item.year.toString().slice(-2)}`,
      value: item.available,
    }))
  }, [history])

  return (
    <ScrollView
      flex={1}
      backgroundColor="$bg"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        {/* Título */}
        <YStack gap="$2">
          <Text fontSize={28} fontWeight="bold" color="$text">
            Margem Consignável
          </Text>
          <Text fontSize={16} color="$muted">
            Acompanhe sua margem disponível
          </Text>
        </YStack>

        {/* Margem Principal */}
        {marginLoading ? (
          <Skeleton width="100%" height={200} />
        ) : margin ? (
          <Card>
            <Card.Content>
              <YStack gap="$4" alignItems="center">
                {/* Valor Disponível */}
                <Text fontSize={48} fontWeight="bold" color="$primary">
                  R$ {margin.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
                <Text fontSize={16} color="$muted">
                  Disponível para empréstimo
                </Text>

                {/* Status */}
                <Card
                  backgroundColor={
                    status === 'healthy'
                      ? '$success'
                      : status === 'warning'
                        ? '$warning'
                        : status === 'critical'
                          ? '$danger'
                          : '$muted'
                  }
                  padding="$2"
                  paddingHorizontal="$4"
                >
                  <Text fontSize={14} fontWeight="600" color="white">
                    {message}
                  </Text>
                </Card>

                {/* Porcentagem */}
                <Text fontSize={16} color="$muted">
                  {percentage.toFixed(1)}% da margem utilizada
                </Text>
              </YStack>
            </Card.Content>
          </Card>
        ) : null}

        {/* Cards de Estatísticas */}
        {!marginLoading && margin && (
          <XStack gap="$3">
            <YStack flex={1}>
              <StatCard
                title="Total"
                value={`R$ ${(margin.total / 1000).toFixed(1)}k`}
                variant="primary"
                trend="neutral"
                trendValue={0}
              />
            </YStack>
            <YStack flex={1}>
              <StatCard
                title="Usado"
                value={`R$ ${(margin.used / 1000).toFixed(1)}k`}
                variant="danger"
                trend="neutral"
                trendValue={0}
              />
            </YStack>
          </XStack>
        )}

        {/* Gráfico de Histórico */}
        <Card>
          <Card.Header>
            <Card.Title>Histórico (12 meses)</Card.Title>
            <Card.Description>Evolução da margem disponível</Card.Description>
          </Card.Header>
          <Card.Content>
            {historyLoading ? (
              <Skeleton width="100%" height={200} />
            ) : chartData.length > 0 ? (
              <Chart data={chartData} type="line" height={200} color="$primary" />
            ) : (
              <Text fontSize={14} color="$muted" textAlign="center">
                Histórico não disponível
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <Card.Header>
            <Card.Title>Como Funciona</Card.Title>
          </Card.Header>
          <Card.Content>
            <YStack gap="$3">
              <InfoItem
                title="O que é margem consignável?"
                description="É o limite máximo que pode ser descontado mensalmente da sua folha de pagamento ou benefício."
              />
              <InfoItem
                title="Como é calculada?"
                description="Geralmente é 30% ou 35% do valor líquido do seu salário ou benefício, conforme legislação."
              />
              <InfoItem
                title="Como aumentar minha margem?"
                description="Quitando empréstimos existentes ou aguardando aumento de salário/benefício."
              />
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
interface InfoItemProps {
  title: string
  description: string
}

function InfoItem({ title, description }: InfoItemProps) {
  return (
    <YStack gap="$1">
      <Text fontSize={14} fontWeight="600" color="$text">
        {title}
      </Text>
      <Text fontSize={14} color="$muted">
        {description}
      </Text>
    </YStack>
  )
}
