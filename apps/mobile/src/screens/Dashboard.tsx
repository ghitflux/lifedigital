import React from 'react'
import { RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text, ScrollView } from 'tamagui'
import { Card, Button, Badge, Skeleton, Alert, StatCard, Progress } from '@life/ui'
import { useUser, useMargin, usePendingSimulations, useDocuments, DocumentStatus } from '../lib/hooks'
import type { DashboardStackNavigationProp } from '../types/navigation'

/**
 * Dashboard Screen - Tela Principal
 *
 * @description
 * Tela principal do aplicativo após login.
 * Exibe um resumo de todas as informações importantes:
 * - Saudação personalizada
 * - Margem disponível
 * - Simulações pendentes
 * - Status de documentos
 * - Ações rápidas
 */
export default function DashboardScreen() {
  const navigation = useNavigation<DashboardStackNavigationProp>()
  const { data: user, isLoading: userLoading } = useUser()
  const { data: margin, isLoading: marginLoading, refetch: refetchMargin } = useMargin()
  const { data: pendingSimulations, count: pendingCount } = usePendingSimulations()
  const { data: documents, refetch: refetchDocuments } = useDocuments()

  const [refreshing, setRefreshing] = React.useState(false)

  // Conta documentos por status
  const pendingDocs = documents?.filter((d) => d.status === DocumentStatus.PENDING).length ?? 0
  const approvedDocs = documents?.filter((d) => d.status === DocumentStatus.APPROVED).length ?? 0

  /**
   * Pull to refresh
   */
  async function handleRefresh() {
    setRefreshing(true)
    await Promise.all([refetchMargin(), refetchDocuments()])
    setRefreshing(false)
  }

  /**
   * Calcula porcentagem de uso da margem
   */
  const marginPercentage = margin ? (margin.used / margin.total) * 100 : 0

  return (
    <ScrollView
      flex={1}
      backgroundColor="$bg"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        {/* Saudação */}
        <YStack gap="$2">
          {userLoading ? (
            <>
              <Skeleton width={200} height={32} />
              <Skeleton width={150} height={20} />
            </>
          ) : (
            <>
              <Text fontSize={28} fontWeight="bold" color="$text">
                Olá, {user?.name?.split(' ')[0] ?? 'Usuário'}! 👋
              </Text>
              <Text fontSize={16} color="$muted">
                Bem-vindo de volta
              </Text>
            </>
          )}
        </YStack>

        {/* Margem Disponível */}
        <Card>
          <Card.Header>
            <Card.Title>Margem Disponível</Card.Title>
            <Card.Description>Quanto você pode solicitar</Card.Description>
          </Card.Header>
          <Card.Content>
            {marginLoading ? (
              <YStack gap="$2">
                <Skeleton width="100%" height={60} />
                <Skeleton width="100%" height={8} />
              </YStack>
            ) : margin ? (
              <YStack gap="$3">
                {/* Valor disponível */}
                <Text fontSize={48} fontWeight="bold" color="$primary">
                  R$ {margin.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>

                {/* Barra de progresso */}
                <YStack gap="$2">
                  <Progress value={marginPercentage} variant="primary" />
                  <XStack justifyContent="space-between">
                    <Text fontSize={12} color="$muted">
                      Usado: R$ {margin.used.toLocaleString('pt-BR')}
                    </Text>
                    <Text fontSize={12} color="$muted">
                      Total: R$ {margin.total.toLocaleString('pt-BR')}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>
            ) : (
              <Alert variant="warning">Não foi possível carregar a margem</Alert>
            )}
          </Card.Content>
          <Card.Footer>
            <Button
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('DetalhesMargem')}
            >
              Ver Detalhes
            </Button>
          </Card.Footer>
        </Card>

        {/* Ações Rápidas */}
        <YStack gap="$3">
          <Text fontSize={18} fontWeight="600" color="$text">
            Ações Rápidas
          </Text>

          <XStack gap="$3">
            <YStack flex={1}>
              <Button
                variant="primary"
                fullWidth
                onPress={() => navigation.navigate('NovaSimulacao')}
              >
                Nova Simulação
              </Button>
            </YStack>
            <YStack flex={1}>
              <Button
                variant="outline"
                fullWidth
                onPress={() => navigation.navigate('Documentos', { screen: 'EnviarDocumento' })}
              >
                Enviar Documento
              </Button>
            </YStack>
          </XStack>
        </YStack>

        {/* Simulações Pendentes */}
        {pendingCount > 0 && (
          <Card>
            <Card.Header>
              <XStack justifyContent="space-between" alignItems="center">
                <Card.Title>Simulações Pendentes</Card.Title>
                <Badge variant="warning">{pendingCount}</Badge>
              </XStack>
              <Card.Description>Aguardando sua análise</Card.Description>
            </Card.Header>
            <Card.Content>
              <YStack gap="$2">
                {pendingSimulations?.slice(0, 2).map((sim) => (
                  <Card key={sim.id} pressable onPress={() => navigation.navigate('DetalhesSimulacao', { id: sim.id })}>
                    <Card.Content padding="$3">
                      <XStack justifyContent="space-between" alignItems="center">
                        <YStack gap="$1">
                          <Text fontSize={16} fontWeight="600" color="$text">
                            R$ {sim.requestedAmount.toLocaleString('pt-BR')}
                          </Text>
                          <Text fontSize={12} color="$muted">
                            {sim.installments}x parcelas
                          </Text>
                        </YStack>
                        <Badge variant="warning">Pendente</Badge>
                      </XStack>
                    </Card.Content>
                  </Card>
                ))}
              </YStack>
            </Card.Content>
            <Card.Footer>
              <Button
                variant="ghost"
                fullWidth
                onPress={() => navigation.navigate('Historico')}
              >
                Ver Todas
              </Button>
            </Card.Footer>
          </Card>
        )}

        {/* Status de Documentos */}
        <Card>
          <Card.Header>
            <Card.Title>Seus Documentos</Card.Title>
            <Card.Description>Status da documentação</Card.Description>
          </Card.Header>
          <Card.Content>
            <XStack gap="$4" justifyContent="space-around">
              <StatCard
                title="Aprovados"
                value={approvedDocs}
                trend="up"
                trendValue={0}
                variant="success"
              />
              <StatCard
                title="Em Análise"
                value={pendingDocs}
                trend="neutral"
                trendValue={0}
                variant="warning"
              />
            </XStack>
          </Card.Content>
          <Card.Footer>
            <Button
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate('Documentos', { screen: 'MeusDocumentos' })}
            >
              Ver Documentos
            </Button>
          </Card.Footer>
        </Card>

        {/* Alerta de Ação Necessária */}
        {pendingDocs > 0 && (
          <Alert variant="info" dismissible>
            Você tem {pendingDocs} documento(s) em análise. Acompanhe o status na seção de documentos.
          </Alert>
        )}
      </YStack>
    </ScrollView>
  )
}
