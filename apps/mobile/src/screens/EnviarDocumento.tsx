import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { YStack, Text, ScrollView } from 'tamagui'
import * as ImagePicker from 'expo-image-picker'
import { Card, Button, Label, Select, Alert } from '@life/ui'
import { useUploadDocument, DocumentType } from '../lib/hooks'
import { useToast } from '@life/ui'

/**
 * Enviar Documento Screen
 *
 * @description
 * Permite ao usuário enviar documentos:
 * - Selecionar tipo de documento
 * - Escolher arquivo (câmera ou galeria)
 * - Fazer upload para MinIO
 */
export default function EnviarDocumentoScreen() {
  const navigation = useNavigation()
  const { toast } = useToast()
  const uploadDocument = useUploadDocument()

  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.RG)
  const [selectedFile, setSelectedFile] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /**
   * Abre a câmera para tirar foto
   */
  async function handleOpenCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Permissão de câmera negada')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setSelectedFile(result.assets[0])
      setError(null)
    }
  }

  /**
   * Abre a galeria para selecionar arquivo
   */
  async function handleOpenGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setSelectedFile(result.assets[0])
      setError(null)
    }
  }

  /**
   * Faz upload do documento
   */
  async function handleUpload() {
    if (!selectedFile) {
      setError('Selecione um arquivo')
      return
    }

    try {
      await uploadDocument.mutateAsync({
        file: {
          uri: selectedFile.uri,
          name: `document-${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: selectedFile.fileSize || 0,
        },
        type: documentType,
        onProgress: setUploadProgress,
      })

      toast({
        title: 'Documento Enviado!',
        description: 'Seu documento está em análise',
        variant: 'success',
      })

      navigation.goBack()
    } catch (err) {
      setError('Erro ao enviar documento')
    }
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        <YStack gap="$2">
          <Text fontSize={28} fontWeight="bold" color="$text">
            Enviar Documento
          </Text>
          <Text fontSize={16} color="$muted">
            Selecione o tipo e envie o arquivo
          </Text>
        </YStack>

        <Card>
          <Card.Content>
            <YStack gap="$4">
              <YStack gap="$2">
                <Label htmlFor="type">Tipo de Documento</Label>
                <Select id="type" value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                  <Select.Item label="RG" value={DocumentType.RG} />
                  <Select.Item label="CPF" value={DocumentType.CPF} />
                  <Select.Item label="Comprovante de Endereço" value={DocumentType.PROOF_OF_ADDRESS} />
                  <Select.Item label="Comprovante de Renda" value={DocumentType.PROOF_OF_INCOME} />
                  <Select.Item label="Contracheque" value={DocumentType.PAYROLL} />
                  <Select.Item label="Outro" value={DocumentType.OTHER} />
                </Select>
              </YStack>

              {selectedFile && (
                <YStack gap="$2">
                  <Text fontSize={14} fontWeight="600">
                    Arquivo Selecionado:
                  </Text>
                  <Text fontSize={14} color="$muted">
                    {selectedFile.fileName || 'Imagem'}
                  </Text>
                </YStack>
              )}

              {error && (
                <Alert variant="danger" dismissible onDismiss={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <YStack gap="$2">
                  <Text fontSize={14}>Enviando: {uploadProgress}%</Text>
                </YStack>
              )}
            </YStack>
          </Card.Content>
        </Card>

        <YStack gap="$3">
          <Button variant="outline" onPress={handleOpenCamera}>
            Tirar Foto
          </Button>
          <Button variant="outline" onPress={handleOpenGallery}>
            Escolher da Galeria
          </Button>
          <Button
            variant="primary"
            onPress={handleUpload}
            loading={uploadDocument.isPending}
            disabled={!selectedFile}
          >
            Enviar Documento
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
