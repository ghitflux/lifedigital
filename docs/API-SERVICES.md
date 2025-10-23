# API Services - Documentação

**Data**: 23 de Outubro de 2025
**Status**: ✅ Completo

---

## 📋 Visão Geral

Camada de serviços que encapsula todas as chamadas HTTP à API do backend. Implementada com Axios e organizada em módulos por domínio.

### Arquitetura

```
services/api/
├── axios-client.ts          # Cliente Axios configurado + interceptors
├── auth.service.ts          # Autenticação e usuário
├── profile.service.ts       # Perfil e dados pessoais
├── documents.service.ts     # Upload e gerenciamento de documentos
├── margin.service.ts        # Margem consignável
├── simulations.service.ts   # Simulações de crédito
└── index.ts                 # Exportações centralizadas
```

### Benefícios

- ✅ Separação clara de responsabilidades
- ✅ Reutilização de código
- ✅ Type-safety completo com TypeScript
- ✅ Interceptors para autenticação e erros
- ✅ Retry automático de tokens expirados
- ✅ Logging estruturado (dev mode)
- ✅ Documentação JSDoc completa

---

## 🔧 Axios Client

### Configuração

```typescript
// Base URL (configurável via env)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'

// Timeout: 30 segundos
// Headers padrão: application/json
```

### Request Interceptor

**Adiciona automaticamente o token de autenticação:**

```typescript
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
```

### Response Interceptor

**Trata erros e renova tokens expirados:**

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 Unauthorized - Tenta renovar token
    if (error.response?.status === 401) {
      const newToken = await refreshToken()
      // Retenta requisição com novo token
      return apiClient(originalRequest)
    }

    // Outros erros: 403, 404, 500, 503, Network, Timeout
    // ...
  }
)
```

### Helper de Erros

```typescript
import { getErrorMessage } from '@/services/api'

try {
  await authService.loginWithGoogle({ idToken })
} catch (error) {
  const message = getErrorMessage(error)
  toast.error(message)
}
```

---

## 🔐 Auth Service

### Funções

#### loginWithGoogle()

Autentica usuário com Google OAuth.

```typescript
const { accessToken, refreshToken, user } = await authService.loginWithGoogle({
  idToken: 'google-id-token-here'
})
```

**Request:**
```json
POST /auth/google
{
  "id_token": "eyJhbGc..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh-token",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "João Silva",
    "picture": "https://...",
    "cpf": null,
    "whatsapp": null,
    "whatsappVerified": false,
    "createdAt": "2025-10-23T10:00:00Z",
    "updatedAt": "2025-10-23T10:00:00Z"
  }
}
```

#### refreshToken()

Renova o access token.

```typescript
const { accessToken } = await authService.refreshToken({
  refreshToken: 'refresh-token-here'
})
```

#### logout()

Invalida o token no backend.

```typescript
await authService.logout()
```

#### getMe()

Obtém dados do usuário autenticado.

```typescript
const user = await authService.getMe()
```

---

## 👤 Profile Service

### Funções

#### getProfile()

Obtém perfil completo.

```typescript
const profile = await profileService.getProfile()
console.log('CPF:', profile.cpf)
console.log('WhatsApp verificado:', profile.whatsappVerified)
```

#### updateProfile()

Atualiza dados do perfil.

```typescript
const updated = await profileService.updateProfile({
  name: 'João Silva',
  picture: 'https://...'
})
```

#### updateCPF()

Atualiza o CPF do usuário.

```typescript
const result = await profileService.updateCPF({
  cpf: '123.456.789-00'
})

if (result.success) {
  console.log('CPF atualizado!')
}
```

**Request:**
```json
PUT /me/cpf
{
  "cpf": "123.456.789-00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "CPF atualizado com sucesso"
}
```

#### updateWhatsApp()

Inicia verificação do WhatsApp (envia OTP).

```typescript
const result = await profileService.updateWhatsApp({
  whatsapp: '+5511999999999'
})

console.log('Verification ID:', result.verificationId)
// Usuário recebe código via WhatsApp
```

**Request:**
```json
PUT /me/whatsapp
{
  "whatsapp": "+5511999999999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Código enviado via WhatsApp",
  "verificationId": "verification-123"
}
```

#### verifyOTP()

Verifica código OTP do WhatsApp.

```typescript
const result = await profileService.verifyOTP({
  code: '123456'
})

if (result.verified) {
  console.log('WhatsApp verificado!')
}
```

**Request:**
```json
POST /me/whatsapp/verify
{
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp verificado com sucesso",
  "verified": true
}
```

---

## 📄 Documents Service

### Tipos

```typescript
enum DocumentType {
  RG = 'rg',
  CPF = 'cpf',
  PROOF_OF_ADDRESS = 'proof_of_address',
  PROOF_OF_INCOME = 'proof_of_income',
  PAYROLL = 'payroll',
  OTHER = 'other',
}

enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
```

### Funções

#### getDocuments()

Lista todos os documentos.

```typescript
const documents = await documentsService.getDocuments()
documents.forEach(doc => {
  console.log(`${doc.fileName}: ${doc.status}`)
})
```

#### getDocument(id)

Obtém documento específico.

```typescript
const document = await documentsService.getDocument('doc-123')
```

#### Fluxo de Upload (3 etapas)

**1. getPresignedUrl()** - Obtém URL pré-assinada do MinIO

```typescript
const { uploadUrl, objectKey } = await documentsService.getPresignedUrl({
  fileName: 'documento.pdf',
  contentType: 'application/pdf',
  fileSize: 1024000
})
```

**2. Upload direto para MinIO**

```typescript
const fileBlob = await fetch(fileUri).then(r => r.blob())

await fetch(uploadUrl, {
  method: 'PUT',
  body: fileBlob,
  headers: { 'Content-Type': 'application/pdf' }
})
```

**3. finalizeUpload()** - Registra no banco

```typescript
const document = await documentsService.finalizeUpload({
  objectKey: objectKey,
  type: DocumentType.RG
})

console.log('Documento criado:', document.id)
```

#### deleteDocument(id)

Remove documento do MinIO e banco.

```typescript
await documentsService.deleteDocument('doc-123')
```

---

## 💰 Margin Service

### Funções

#### getMargin()

Consulta margem atual.

```typescript
const margin = await marginService.getMargin()

console.log('Total:', margin.total)           // Ex: R$ 5.000
console.log('Usado:', margin.used)            // Ex: R$ 2.000
console.log('Disponível:', margin.available)  // Ex: R$ 3.000

const percentage = (margin.used / margin.total) * 100
console.log(`${percentage}% utilizado`)
```

**Response:**
```json
{
  "total": 5000.00,
  "used": 2000.00,
  "available": 3000.00,
  "lastUpdated": "2025-10-23T10:00:00Z"
}
```

#### getMarginHistory()

Obtém histórico (12 meses).

```typescript
const history = await marginService.getMarginHistory()

// Exibir em gráfico
const chartData = history.map(item => ({
  label: `${item.month}/${item.year}`,
  value: item.available
}))
```

**Response:**
```json
[
  {
    "month": "10",
    "year": 2025,
    "total": 5000.00,
    "used": 2000.00,
    "available": 3000.00
  },
  ...
]
```

---

## 🔢 Simulations Service

### Tipos

```typescript
enum ProductType {
  CONSIGNADO = 'consignado',
  CARTAO_CONSIGNADO = 'cartao_consignado',
  REFIN = 'refin',
  PORTABILIDADE = 'portabilidade',
}

enum SimulationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
}
```

### Funções

#### getSimulations()

Lista todas as simulações.

```typescript
const simulations = await simulationsService.getSimulations()
```

#### getSimulation(id)

Obtém simulação específica.

```typescript
const simulation = await simulationsService.getSimulation('sim-123')
console.log('CET:', simulation.cet)
console.log('Parcela:', simulation.monthlyPayment)
```

#### createSimulation()

Cria nova simulação.

```typescript
const simulation = await simulationsService.createSimulation({
  productType: ProductType.CONSIGNADO,
  requestedAmount: 10000,
  installments: 24
})

if (simulation.status === SimulationStatus.APPROVED) {
  console.log('Aprovado!')
  console.log('Valor aprovado:', simulation.approvedAmount)
  console.log('Taxa de juros:', simulation.interestRate)
  console.log('CET:', simulation.cet)
  console.log('Parcela:', simulation.monthlyPayment)
  console.log('Total a pagar:', simulation.totalAmount)
} else {
  console.log('Rejeitado:', simulation.rejectionReason)
}
```

**Request:**
```json
POST /simulacoes
{
  "product_type": "consignado",
  "requested_amount": 10000,
  "installments": 24
}
```

**Response (Aprovada):**
```json
{
  "id": "sim-123",
  "userId": "user-123",
  "productType": "consignado",
  "requestedAmount": 10000.00,
  "approvedAmount": 10000.00,
  "installments": 24,
  "interestRate": 1.80,
  "cet": 2.14,
  "monthlyPayment": 487.50,
  "totalAmount": 11700.00,
  "status": "approved",
  "createdAt": "2025-10-23T10:00:00Z",
  "updatedAt": "2025-10-23T10:00:00Z",
  "expiresAt": "2025-10-30T10:00:00Z"
}
```

#### approveSimulation(id)

Aceita simulação (confirma contratação).

```typescript
const simulation = await simulationsService.approveSimulation('sim-123')

if (simulation.status === SimulationStatus.ACCEPTED) {
  console.log('Contratação iniciada!')
}
```

#### cancelSimulation(id)

Cancela simulação.

```typescript
await simulationsService.cancelSimulation('sim-123')
```

---

## 📊 Uso com TanStack Query Hooks

Os services são usados internamente pelos hooks do TanStack Query:

```typescript
// Hook usa o service internamente
export function useMargin() {
  return useQuery({
    queryKey: queryKeys.margin,
    queryFn: async () => {
      return await marginService.getMargin() // ← Service
    },
  })
}

// Uso no componente
const { data: margin, isLoading } = useMargin()
```

---

## 🎯 Padrões de Uso

### Uso Direto (sem hooks)

```typescript
import { authService, marginService } from '@/services/api'

async function fetchData() {
  try {
    const user = await authService.getMe()
    const margin = await marginService.getMargin()

    console.log(`${user.name} tem R$ ${margin.available} disponível`)
  } catch (error) {
    console.error('Erro:', getErrorMessage(error))
  }
}
```

### Uso com Hooks (Recomendado)

```typescript
import { useUser, useMargin } from '@/lib/hooks'

function MyComponent() {
  const { data: user, isLoading: userLoading } = useUser()
  const { data: margin, isLoading: marginLoading } = useMargin()

  if (userLoading || marginLoading) return <Loading />

  return (
    <View>
      <Text>{user.name}</Text>
      <Text>Margem: R$ {margin.available}</Text>
    </View>
  )
}
```

---

## ✅ Checklist de Implementação

- ✅ Axios client configurado
- ✅ Request interceptor (adiciona token)
- ✅ Response interceptor (trata erros + renova token)
- ✅ Auth service (4 funções)
- ✅ Profile service (5 funções)
- ✅ Documents service (5 funções)
- ✅ Margin service (2 funções)
- ✅ Simulations service (5 funções)
- ✅ Error handling helper
- ✅ TypeScript completo
- ✅ JSDoc em todas as funções
- ✅ Exportações centralizadas

---

## 📊 Estatísticas

| Service | Funções | Linhas de Código |
|---------|---------|------------------|
| **axios-client** | 1 helper | ~200 |
| **auth** | 4 | ~140 |
| **profile** | 5 | ~180 |
| **documents** | 5 | ~200 |
| **margin** | 2 | ~100 |
| **simulations** | 5 | ~200 |
| **TOTAL** | **21 funções** | **~1020 linhas** |

---

## 🚀 Próximos Passos

1. **Implementar Páginas** - Usar os hooks nas 16 telas
2. **Integrações** - Google OAuth, MinIO, Notifications
3. **Testes** - Unit tests para os services

---

**Gerado em**: 23/10/2025
**Por**: Claude (Anthropic)
**Projeto**: Life Digital - Crédito Consignado
