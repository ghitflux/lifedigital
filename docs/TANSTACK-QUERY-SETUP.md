# TanStack Query Setup - Documentação

**Data**: 23 de Outubro de 2025
**Status**: ✅ Completo

---

## 📋 Visão Geral

Implementação completa do TanStack Query (React Query v5) para gerenciamento de estado assíncrono e cache de dados da API.

### Benefícios
- ✅ Cache inteligente de requisições HTTP
- ✅ Sincronização automática com servidor
- ✅ Loading e error states automáticos
- ✅ Retry automático com backoff exponencial
- ✅ Invalidação de cache otimizada
- ✅ Sincronização com Zustand stores
- ✅ TypeScript completo

---

## 📁 Arquivos Criados

```
apps/mobile/src/lib/
├── queryClient.ts                    # Configuração global do QueryClient
└── hooks/
    ├── index.ts                      # Exportações centralizadas
    ├── useAuth.ts                    # Hooks de autenticação (4 hooks)
    ├── useProfile.ts                 # Hooks de perfil (5 hooks)
    ├── useDocuments.ts               # Hooks de documentos (5 hooks)
    ├── useMargin.ts                  # Hooks de margem (4 hooks)
    └── useSimulations.ts             # Hooks de simulações (7 hooks)
```

**Total**: 8 arquivos | ~1000 linhas de código | 25+ hooks

---

## ⚙️ Configuração Global

### queryClient.ts

```typescript
// Configuração do QueryClient
{
  queries: {
    staleTime: 5 minutos,      // Dados considerados "frescos"
    gcTime: 1 hora,            // Tempo em cache antes de limpeza
    retry: 3,                  // Número de tentativas
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  },
  mutations: {
    retry: 1,                  // Apenas 1 tentativa (segurança)
    retryDelay: 1000,
  }
}
```

### Query Keys

Constantes centralizadas para evitar erros:

```typescript
queryKeys = {
  user: ['user'],
  profile: ['profile'],
  documents: ['documents'],
  document: (id) => ['documents', id],
  margin: ['margin'],
  marginHistory: ['margin', 'history'],
  simulations: ['simulations'],
  simulation: (id) => ['simulations', id],
  notifications: ['notifications'],
}
```

---

## 🔐 Hooks de Autenticação (useAuth.ts)

### useUser()
Query para buscar dados do usuário autenticado.

```tsx
const { data: user, isLoading, error } = useUser()

// Retorna:
{
  id: string
  email: string
  name: string
  picture?: string
  cpf?: string
  whatsapp?: string
  whatsappVerified: boolean
  createdAt: string
  updatedAt: string
}
```

### useLoginWithGoogle()
Mutation para login com Google OAuth.

```tsx
const loginWithGoogle = useLoginWithGoogle()

await loginWithGoogle.mutateAsync({ idToken: 'google-id-token' })
// Salva tokens automaticamente no authStore
```

### useRefreshToken()
Mutation para renovar access token.

```tsx
const refreshToken = useRefreshToken()

await refreshToken.mutateAsync()
// Atualiza accessToken automaticamente
```

### useLogout()
Mutation para logout completo.

```tsx
const logout = useLogout()

await logout.mutateAsync()
// Limpa tokens, cache e reseta estado
```

---

## 👤 Hooks de Perfil (useProfile.ts)

### useProfile()
Query para dados do perfil.

```tsx
const { data: profile, isLoading } = useProfile()
// Sincroniza automaticamente com profileStore
```

### useUpdateCPF()
Mutation para atualizar CPF.

```tsx
const updateCPF = useUpdateCPF()

await updateCPF.mutateAsync({ cpf: '123.456.789-00' })
// Invalida cache do perfil automaticamente
```

### useUpdateWhatsApp()
Mutation para atualizar WhatsApp (envia OTP).

```tsx
const updateWhatsApp = useUpdateWhatsApp()

const result = await updateWhatsApp.mutateAsync({
  whatsapp: '+5511999999999'
})
console.log('Verification ID:', result.verificationId)
```

### useVerifyOTP()
Mutation para verificar código OTP.

```tsx
const verifyOTP = useVerifyOTP()

const result = await verifyOTP.mutateAsync({ code: '123456' })
if (result.verified) {
  console.log('WhatsApp verificado!')
}
```

### useUpdateProfile()
Mutation genérica para atualizar perfil.

```tsx
const updateProfile = useUpdateProfile()

await updateProfile.mutateAsync({
  name: 'Novo Nome',
  picture: 'https://...',
})
```

---

## 📄 Hooks de Documentos (useDocuments.ts)

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

### useDocuments()
Query para listar documentos.

```tsx
const { data: documents, isLoading } = useDocuments()
// Sincroniza com documentsStore
```

### useDocument(id)
Query para documento específico.

```tsx
const { data: document } = useDocument('doc-123')
```

### useUploadDocument()
Mutation completa para upload (3 etapas automáticas).

```tsx
const uploadDocument = useUploadDocument()

await uploadDocument.mutateAsync({
  file: {
    uri: 'file:///path/to/file.pdf',
    name: 'documento.pdf',
    type: 'application/pdf',
    size: 1024000,
  },
  type: DocumentType.RG,
  onProgress: (progress) => console.log(`${progress}%`),
})

// Etapa 1: Obtém URL pré-assinada do backend
// Etapa 2: Upload para MinIO
// Etapa 3: Finaliza no backend (registra no DB)
```

### useDeleteDocument()
Mutation para deletar documento.

```tsx
const deleteDocument = useDeleteDocument()

await deleteDocument.mutateAsync('doc-123')
// Remove do MinIO e do banco
```

---

## 💰 Hooks de Margem (useMargin.ts)

### useMargin()
Query para margem atual.

```tsx
const { data: margin, isLoading, refetch } = useMargin()

// Retorna:
{
  total: number        // Margem total disponível
  used: number         // Margem já utilizada
  available: number    // Margem disponível
  lastUpdated: string
}

// Auto-refetch a cada 5 minutos
```

### useMarginHistory()
Query para histórico (12 meses).

```tsx
const { data: history } = useMarginHistory()

// Retorna array de:
{
  month: string
  year: number
  total: number
  used: number
  available: number
}
```

### useMarginPercentage()
Hook customizado que calcula porcentagem de utilização.

```tsx
const { data: percentage, margin } = useMarginPercentage()

console.log(`${percentage}% utilizado`)
```

### useMarginStatus()
Hook customizado que retorna status da margem.

```tsx
const { status, color, message, percentage } = useMarginStatus()

// Status possíveis:
// - 'healthy' (0-50%) - verde
// - 'warning' (50-80%) - amarelo
// - 'critical' (80-100%) - vermelho
// - 'unavailable' - cinza
```

---

## 🔢 Hooks de Simulações (useSimulations.ts)

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

### useSimulations()
Query para listar simulações.

```tsx
const { data: simulations, isLoading } = useSimulations()
// Ordenado por data (mais recentes primeiro)
```

### useSimulation(id)
Query para simulação específica.

```tsx
const { data: simulation } = useSimulation('sim-123')
```

### useCreateSimulation()
Mutation para criar simulação.

```tsx
const createSimulation = useCreateSimulation()

const result = await createSimulation.mutateAsync({
  productType: ProductType.CONSIGNADO,
  requestedAmount: 10000,
  installments: 24,
})

console.log('CET:', result.cet)
console.log('Parcela:', result.monthlyPayment)
```

### useApproveSimulation()
Mutation para aceitar simulação.

```tsx
const approveSimulation = useApproveSimulation()

await approveSimulation.mutateAsync({
  simulationId: 'sim-123'
})
// Invalida margem automaticamente
```

### useCancelSimulation()
Mutation para cancelar simulação.

```tsx
const cancelSimulation = useCancelSimulation()

await cancelSimulation.mutateAsync({
  simulationId: 'sim-123'
})
```

### usePendingSimulations()
Hook customizado para simulações pendentes.

```tsx
const { data: pendingSimulations, count } = usePendingSimulations()

console.log(`${count} simulações pendentes`)
```

### useApprovedSimulations()
Hook customizado para simulações aprovadas.

```tsx
const { data: approvedSimulations, count } = useApprovedSimulations()
```

---

## 🔄 Sincronização com Zustand

Todos os hooks principais sincronizam automaticamente com os Zustand stores:

```tsx
// Exemplo: useProfile
onSuccess: (data) => {
  setProfile(data) // Atualiza profileStore
}

// Exemplo: useUploadDocument
onSuccess: (data) => {
  addDocument(data)    // Atualiza documentsStore
  queryClient.invalidateQueries({ queryKey: queryKeys.documents })
}
```

---

## 🎯 Padrões de Uso

### Loading States

```tsx
const { data, isLoading, error } = useMargin()

if (isLoading) return <Skeleton />
if (error) return <Alert variant="danger">{error.message}</Alert>

return <Text>Margem: R$ {data.available}</Text>
```

### Mutations com Feedback

```tsx
const updateCPF = useUpdateCPF()

async function handleSubmit(cpf: string) {
  try {
    await updateCPF.mutateAsync({ cpf })
    toast.success('CPF atualizado com sucesso!')
  } catch (error) {
    toast.error('Erro ao atualizar CPF')
  }
}

return (
  <Button
    onPress={() => handleSubmit('123.456.789-00')}
    loading={updateCPF.isPending}
  >
    Atualizar CPF
  </Button>
)
```

### Invalidação Manual de Cache

```tsx
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryClient'

const queryClient = useQueryClient()

// Invalida margem após operação
queryClient.invalidateQueries({ queryKey: queryKeys.margin })

// Ou atualiza diretamente
queryClient.setQueryData(queryKeys.user, newUserData)
```

---

## 📊 Estatísticas

| Categoria | Hooks | Descrição |
|-----------|-------|-----------|
| **Auth** | 4 | Login, logout, refresh, user |
| **Profile** | 5 | Perfil, CPF, WhatsApp, OTP |
| **Documents** | 5 | Listar, upload, delete |
| **Margin** | 4 | Margem, histórico, %, status |
| **Simulations** | 7 | CRUD + filtros customizados |
| **TOTAL** | **25 hooks** | Cobertura completa da API |

---

## ✅ Checklist de Implementação

- ✅ QueryClient configurado
- ✅ Query keys centralizadas
- ✅ 25 hooks customizados
- ✅ TypeScript completo
- ✅ JSDoc em todos os hooks
- ✅ Sincronização com Zustand
- ✅ Invalidação de cache otimizada
- ✅ Error handling
- ✅ Loading states
- ✅ Retry automático
- ✅ Integrado no App.tsx

---

## 🚀 Próximos Passos

1. **Services de API** - Criar camada de serviços com Axios
2. **Implementar Páginas** - Usar os hooks nas 16 telas
3. **Testes** - Unit tests para os hooks

---

**Gerado em**: 23/10/2025
**Por**: Claude (Anthropic)
**Projeto**: Life Digital - Crédito Consignado
