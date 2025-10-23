import React, { useState } from 'react'
import { RefreshControl, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { YStack, XStack, Text } from 'tamagui'
import { Card, Button, Badge, Skeleton } from '@life/ui'
import { useDocuments, DocumentStatus, DocumentType } from '../lib/hooks'
import type { DocumentosStackNavigationProp } from '../types/navigation'

/**
 * Meus Documentos Screen
 *
 * @description
 * Lista todos os documentos enviados pelo usuário.
 * Exibe status de cada documento (pendente, aprovado, rejeitado).
 */
export default function MeusDocumentosScreen() {
  const navigation = useNavigation<DocumentosStackNavigationProp>()
  const { data: documents, isLoading, refetch } = useDocuments()
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  function renderItem({ item }: { item: typeof documents[0] }) {
    return (
      <Card marginBottom="$3">
        <Card.Content padding="$4">
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={16} fontWeight="600" color="$text">
                {getDocumentTypeLabel(item.type)}
              </Text>
              <Badge
                variant={
                  item.status === DocumentStatus.APPROVED
                    ? 'success'
                    : item.status === DocumentStatus.REJECTED
                      ? 'danger'
                      : 'warning'
                }
              >
                {item.status === DocumentStatus.APPROVED && 'Aprovado'}
                {item.status === DocumentStatus.REJECTED && 'Rejeitado'}
                {item.status === DocumentStatus.PENDING && 'Em análise'}
              </Badge>
            </XStack>
            <Text fontSize={14} color="$muted">
              {item.fileName}
            </Text>
            <Text fontSize={12} color="$muted">
              Enviado em {new Date(item.uploadedAt).toLocaleDateString('pt-BR')}
            </Text>
            {item.rejectionReason && (
              <Text fontSize={12} color="$danger">
                Motivo: {item.rejectionReason}
              </Text>
            )}
          </YStack>
        </Card.Content>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <YStack flex={1} backgroundColor="$bg" padding="$4" gap="$3">
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={100} />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$bg">
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <YStack marginBottom="$4">
            <Button variant="primary" onPress={() => navigation.navigate('EnviarDocumento')}>
              Enviar Novo Documento
            </Button>
          </YStack>
        }
        ListEmptyComponent={
          <YStack alignItems="center" paddingVertical="$8">
            <Text fontSize={16} color="$muted">
              Nenhum documento enviado
            </Text>
          </YStack>
        }
      />
    </YStack>
  )
}

function getDocumentTypeLabel(type: DocumentType): string {
  const labels = {
    [DocumentType.RG]: 'RG',
    [DocumentType.CPF]: 'CPF',
    [DocumentType.PROOF_OF_ADDRESS]: 'Comprovante de Endereço',
    [DocumentType.PROOF_OF_INCOME]: 'Comprovante de Renda',
    [DocumentType.PAYROLL]: 'Contracheque',
    [DocumentType.OTHER]: 'Outro',
  }
  return labels[type] || type
}
