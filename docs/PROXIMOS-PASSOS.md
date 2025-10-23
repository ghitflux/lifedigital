# Próximos Passos - Continuar de Onde Paramos

**Última Atualização**: 23 de Outubro de 2025
**Status Atual**: 38% da Fase 1 completo
**Próxima Tarefa**: TanStack Query Setup

---

## 📍 ONDE ESTAMOS AGORA

### ✅ JÁ COMPLETADO (38%)

#### 1. Infraestrutura (100%) ✅
- ✅ Monorepo (pnpm + Turborepo)
- ✅ Backend FastAPI rodando
- ✅ Docker Compose com 5 serviços (Postgres, Redis, MinIO, ClamAV, API)
- ✅ Swagger UI: http://localhost:8080/docs

#### 2. Design System (100%) ✅
- ✅ **51 Componentes UI** completos
  - ✅ 5 Primitivos (Button, Input, Label, Textarea, Separator)
  - ✅ 4 Layout (Card, AspectRatio, ScrollArea, ResizablePanel)
  - ✅ 8 Feedback (Alert, Badge, Skeleton, Progress, Toast, Toaster, Sonner, useToast)
  - ✅ 7 Navegação (MobileNav, Tabs, Breadcrumb, Pagination, NavigationMenu, Menubar, Sidebar)
  - ✅ 7 Formulários (Checkbox, RadioGroup, Switch, Slider, Select, InputOTP, Form)
  - ✅ 10 Dialogs (Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Command)
  - ✅ 10 Avançados (Accordion, Collapsible, Carousel, Calendar, Table, Toggle, ToggleGroup, Chart, StatCard, Avatar)
- ✅ Tamagui configurado com tokens customizados
- ✅ Todos documentados com JSDoc

#### 3. React Navigation (100%) ✅
- ✅ RootNavigator com splash/auth/app
- ✅ AuthStack (Welcome, Login)
- ✅ AppTabs (Bottom tabs com 4 seções)
- ✅ 4 Stack Navigators internos (Dashboard, Margem, Documentos, Perfil)
- ✅ Deep linking configurado (`lifedigital://`)
- ✅ TypeScript types completos

#### 4. Zustand Stores (100%) ✅
- ✅ authStore (com persist MMKV criptografado)
- ✅ profileStore
- ✅ documentsStore
- ✅ marginStore
- ✅ simulationsStore
- ✅ notificationsStore

---

## 🎯 PRÓXIMOS PASSOS (Ordem Recomendada)

### 1. ⏳ TanStack Query Setup (PRÓXIMO - 2 horas)

**O que fazer**: Configurar TanStack Query para gerenciar chamadas à API

**Passos**:

1. **Criar QueryClient** em `apps/mobile/src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 60, // 1 hora
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})
```

2. **Integrar no App.tsx**:
```typescript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './src/lib/queryClient'

// Adicionar wrapper no App.tsx:
<QueryClientProvider client={queryClient}>
  {/* resto do app */}
</QueryClientProvider>
```

3. **Criar hooks customizados** em `apps/mobile/src/lib/hooks/`:

1. **queryClient.ts**
   ```typescript
   - QueryClient configuration
   - Default options
   - Cache time
   - Retry logic
   ```

2. **hooks/useAuth.ts**
   - useLogin mutation
   - useLogout mutation
   - useUser query

3. **hooks/useProfile.ts**
   - useProfile query
   - useUpdateProfile mutation

4. **hooks/useDocuments.ts**
   - useDocuments query
   - useUploadDocument mutation

5. **hooks/useMargin.ts**
   - useMargin query

6. **hooks/useSimulations.ts**
   - useSimulations query
   - useCreateSimulation mutation
   - useApproveSimulation mutation

**Arquivos a criar**:
- `apps/mobile/src/lib/queryClient.ts`
- `apps/mobile/src/lib/hooks/useAuth.ts`
- `apps/mobile/src/lib/hooks/useProfile.ts`
- `apps/mobile/src/lib/hooks/useDocuments.ts`
- `apps/mobile/src/lib/hooks/useMargin.ts`
- `apps/mobile/src/lib/hooks/useSimulations.ts`

---

### 2. Services de API (2 horas)

**O que fazer**: Criar camada de serviços para comunicação com API

**Criar em** `apps/mobile/src/services/`:

#### 1. axios-client.ts
```typescript
- Base URL configuration
- Request interceptor (add auth token)
- Response interceptor (handle errors)
- Retry logic
```

#### 2. auth.service.ts
```typescript
- loginWithGoogle(idToken)
- refreshToken()
- logout()
```

#### 3. profile.service.ts
```typescript
- getProfile()
- updateCPF(cpf)
- updateWhatsApp(phone)
- verifyOTP(code)
```

#### 4. documents.service.ts
```typescript
- getDocuments()
- uploadDocument(file)
- deleteDocument(id)
- getPresignedUrl()
```

#### 5. margin.service.ts
```typescript
- getMargin()
- getHistory()
```

#### 6. simulations.service.ts
```typescript
- getSimulations()
- getSimulation(id)
- createSimulation(data)
- approveSimulation(id)
```

**Arquivos a criar**:
- `apps/mobile/src/services/api/axios-client.ts`
- `apps/mobile/src/services/api/auth.service.ts`
- `apps/mobile/src/services/api/profile.service.ts`
- `apps/mobile/src/services/api/documents.service.ts`
- `apps/mobile/src/services/api/margin.service.ts`
- `apps/mobile/src/services/api/simulations.service.ts`

**Base URL**: http://localhost:8080 (API já está rodando!)

---

### 3. Páginas (16 telas - 6-8 horas)

**O que fazer**: Implementar todas as telas do app

**Criar em** `apps/mobile/src/screens/`:

**Estrutura de pastas**:
```
apps/mobile/src/screens/
├── auth/
│   ├── Welcome.tsx
│   └── Login.tsx
├── dashboard/
│   └── Dashboard.tsx
├── simulations/
│   ├── NovaSimulacao.tsx
│   ├── DetalhesSimulacao.tsx
│   └── Historico.tsx
├── margin/
│   └── DetalhesMargem.tsx
├── documents/
│   ├── MeusDocumentos.tsx
│   └── EnviarDocumento.tsx
├── profile/
│   ├── Perfil.tsx
│   ├── DadosPessoais.tsx
│   ├── SegurancaPrivacidade.tsx
│   ├── Notificacoes.tsx
│   └── AjudaSuporte.tsx
└── NotFound.tsx
```

**Nota**: Os arquivos de navegação já existem com placeholders. Substituir os placeholders pelas páginas reais.

---

### 4. Integrações (3 horas)

#### A. Google OAuth (Expo AuthSession)
```typescript
// apps/mobile/src/services/auth/google.ts
- useAuthRequest() hook
- promptAsync() to trigger login
- Exchange code for tokens
- Validate ID token on backend
```

#### B. MinIO Upload
```typescript
// apps/mobile/src/services/storage/minio.ts
- getPresignedUrl()
- uploadFile(file, presignedUrl)
- Progress tracking
- Error handling
```

#### C. Expo Notifications
```typescript
// apps/mobile/src/services/notifications/expo.ts
- registerForPushNotifications()
- getExpoPushToken()
- Notification listeners
- Handle notification tap
- Badge count
```

#### D. MMKV Storage
```typescript
// apps/mobile/src/services/storage/mmkv.ts
- storage.set()
- storage.get()
- Encrypted storage for tokens
```

**Arquivos a criar**:
- `apps/mobile/src/services/auth/google.ts`
- `apps/mobile/src/services/storage/minio.ts`
- `apps/mobile/src/services/notifications/expo.ts`

---

### 5. Testes (10-12 horas)

**Setup necessário**:
1. **Welcome.tsx**
   - Intro slider
   - "Começar" button → Auth

2. **Auth.tsx**
   - Google Sign In button
   - Terms acceptance

3. **Index.tsx**
   - Splash screen
   - Route logic (authenticated → Dashboard, não → Welcome)

#### Dashboard (1 página - 1h)
4. **Dashboard.tsx**
   - Card de margem disponível
   - Últimas simulações (lista)
   - Documentos pendentes
   - Quick actions

#### Perfil/Dados (3 páginas - 2h)
5. **DadosPessoais.tsx**
   - Form com CPF
   - WhatsApp + verificação OTP
   - Nome, email (readonly do Google)

6. **Perfil.tsx**
   - Avatar
   - Dados básicos
   - Editar button → DadosPessoais

7. **SegurancaPrivacidade.tsx**
   - Políticas de privacidade
   - Termos de uso
   - Excluir conta (com confirmação)

#### Documentos (2 páginas - 1.5h)
8. **EnviarDocumento.tsx**
   - ImagePicker (camera/galeria)
   - Preview
   - Upload button
   - Progress indicator

9. **MeusDocumentos.tsx**
   - Lista de documentos
   - Status: pendente/aprovado/rejeitado
   - Badge de status
   - Ver/Excluir

#### Margem (1 página - 1h)
10. **DetalhesMargem.tsx**
    - Valor total disponível (grande)
    - Bruto, utilizado, disponível
    - Gráfico histórico (Chart component)
    - Lista histórico mensal

#### Simulações (3 páginas - 2h)
11. **NovaSimulacao.tsx**
    - Form: tipo de produto (select)
    - Valor desejado (input)
    - Prazo (slider)
    - Simulação prévia
    - Enviar button

12. **DetalhesSimulacao.tsx**
    - Status (badge)
    - Resultado: CET, parcela, total
    - Condições
    - Botões: Aceitar/Recusar

13. **Historico.tsx**
    - Lista de simulações
    - Filtro por status
    - Card por simulação
    - Tap → DetalhesSimulacao

#### Outros (3 páginas - 1h)
14. **Notificacoes.tsx**
    - Lista de notificações
    - Mark as read
    - Filtro: todas/não lidas
    - Empty state

15. **AjudaSuporte.tsx**
    - FAQ (Accordion)
    - Contato via WhatsApp
    - Email suporte

16. **NotFound.tsx**
    - 404 illustration
    - Voltar para home

1. **Criar jest.config.js** na raiz do mobile
2. **Criar setupTests.ts**
3. **Instalar dependências** de teste (já no package.json)

#### Unit Tests (5-6h)
Para cada componente (~51):
```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {})
  it('handles props', () => {})
  it('handles interactions', () => {})
  it('shows error state', () => {})
  it('is accessible', () => {})
})
```

Configuração:
- Jest + React Native Testing Library
- Mock de navegação
- Mock de API
- Coverage 80%+

#### Integration Tests (3-4h)
Para cada página (~15):
```typescript
describe('PageName Screen', () => {
  it('loads data', () => {})
  it('submits form', () => {})
  it('navigates correctly', () => {})
  it('handles errors', () => {})
})
```

#### E2E Tests - Detox (2-3h)
Fluxos críticos:
1. Login → Dashboard
2. Dashboard → Nova Simulação → Aceite
3. Upload Documento → Ver Status
4. Consultar Margem → Ver Histórico

---

### 6. Storybook React Native (4-5 horas)

#### Setup
```bash
npx sb init --type react_native
```

#### Stories
Para cada componente:
```typescript
// Button.stories.tsx
export default {
  title: 'Primitives/Button',
  component: Button,
}

export const Default = () => <Button>Click me</Button>
export const Primary = () => <Button variant="primary">Primary</Button>
// ... todas as variações
```

#### Features
- Controles interativos (knobs)
- Addon de acessibilidade
- Dark/Light theme toggle
- Device frames

---

### 7. CI/CD - GitHub Actions (2 horas)

#### Workflows
Criar em `.github/workflows/`:

1. **lint.yml**
   ```yaml
   - ESLint
   - Prettier check
   - TypeScript typecheck
   ```

2. **test.yml**
   ```yaml
   - Unit tests
   - Coverage report
   - Upload to Codecov
   ```

3. **build.yml**
   ```yaml
   - Build iOS (EAS)
   - Build Android (EAS)
   - Upload artifacts
   ```

4. **e2e.yml**
   ```yaml
   - Detox tests
   - Screenshot on failure
   ```

---

## 📊 Timeline Estimado RESTANTE

| Fase | Tempo Estimado | Status |
|------|----------------|--------|
| ~~1. Infraestrutura~~ | ~~2-3h~~ | ✅ Completo |
| ~~2. Componentes UI (51)~~ | ~~7-8h~~ | ✅ Completo |
| ~~3. React Navigation~~ | ~~1h~~ | ✅ Completo |
| ~~4. Zustand Stores (6)~~ | ~~1h~~ | ✅ Completo |
| 5. TanStack Query | 2h | ⏳ **PRÓXIMO** |
| 6. Services de API | 2h | ⏳ Pendente |
| 7. Páginas (16) | 6-8h | ⏳ Pendente |
| 8. Integrações | 3h | ⏳ Pendente |
| 9. Testes | 10-12h | ⏳ Pendente |
| 10. Storybook | 4-5h | ⏳ Pendente |
| 11. CI/CD | 2h | ⏳ Pendente |

**Já completo**: 12-13 horas ✅
**Restante**: 30-35 horas ⏳
**Total Fase 1**: 42-48 horas

---

## 🚀 COMO CONTINUAR

### Passo 1: Verificar que Docker está rodando

```bash
cd lifedigital
docker compose -f infra/docker/compose.yml ps
```

**Deve mostrar 5 containers rodando**: api, postgres, redis, minio, clamav

Se não estiver rodando:
```bash
docker compose -f infra/docker/compose.yml up -d
```

### Passo 2: Validar API

```bash
curl http://localhost:8080/
# Deve retornar: {"status":"ok"}

# Abrir Swagger no navegador:
start http://localhost:8080/docs
```

### Passo 3: Começar próxima tarefa (TanStack Query)

**Cole no próximo chat**:
```
Estou continuando o projeto Life Digital de onde paramos.

STATUS:
- ✅ 51 componentes UI completos
- ✅ React Navigation completa
- ✅ 6 Zustand stores completos
- ✅ Backend API rodando em localhost:8080

PRÓXIMA TAREFA:
Implementar TanStack Query setup conforme docs/PROXIMOS-PASSOS.md

Arquivos a criar:
1. apps/mobile/src/lib/queryClient.ts
2. apps/mobile/src/lib/hooks/useAuth.ts
3. apps/mobile/src/lib/hooks/useProfile.ts
4. apps/mobile/src/lib/hooks/useDocuments.ts
5. apps/mobile/src/lib/hooks/useMargin.ts
6. apps/mobile/src/lib/hooks/useSimulations.ts
7. Integrar QueryClientProvider no App.tsx

Crie tudo sem simplificar, com implementação completa.
```

---

## 📁 Estrutura Atual do Projeto

```
lifedigital/
├── apps/mobile/
│   ├── src/
│   │   ├── navigation/        ✅ 8 arquivos (completo)
│   │   ├── stores/            ✅ 7 arquivos (completo)
│   │   ├── types/             ✅ 1 arquivo (completo)
│   │   ├── lib/               ⏳ Criar (TanStack Query)
│   │   ├── services/          ⏳ Criar (API services)
│   │   └── screens/           ⏳ Criar (16 páginas)
│   └── App.tsx                ✅ Integrado
├── packages/
│   ├── tokens/                ✅ Completo
│   └── ui/                    ✅ 51 componentes
├── services/api/              ✅ Backend rodando
├── infra/docker/              ✅ Compose rodando
└── docs/                      ✅ 7 arquivos .md
```

---

## 🔧 Comandos Úteis

### Backend/Docker
```bash
# Ver status dos containers
docker compose -f infra/docker/compose.yml ps

# Ver logs da API
docker compose -f infra/docker/compose.yml logs -f api

# Parar tudo
docker compose -f infra/docker/compose.yml down

# Recriar tudo
docker compose -f infra/docker/compose.yml up -d --build

# Testar API
curl http://localhost:8080/
curl http://localhost:8080/docs
```

### Frontend/Mobile
```bash
# Instalar dependências (se necessário)
pnpm install

# Rodar app mobile (quando pronto)
pnpm --filter @life/mobile dev

# Lint
pnpm lint

# Typecheck
pnpm typecheck
```

---

## ✅ Checklist do Que Falta

### Backend & Integrações
- [ ] TanStack Query configurado
- [ ] Services de API (Axios client + 6 services)
- [ ] Google OAuth funcionando
- [ ] Upload MinIO funcionando
- [ ] Expo Notifications funcionando

### Frontend
- [ ] 16 páginas implementadas
- [ ] Navegação conectada às páginas reais
- [ ] Forms com validação
- [ ] Loading/error states

### Qualidade
- [ ] Unit tests (51 componentes, 80%+ coverage)
- [ ] Integration tests (16 páginas)
- [ ] E2E tests (Detox, fluxos críticos)
- [ ] Storybook com todos os componentes

### Deploy & CI
- [ ] GitHub Actions (lint, test, build)
- [ ] Builds iOS/Android funcionando
- [ ] App publicável nas stores

---

## 📚 Documentação Disponível

Todos os arquivos estão em `/docs`:
- **FASE1-PROGRESSO.md** - Progresso detalhado com tabelas
- **COMPONENTES-IMPLEMENTADOS.md** - Docs de todos os 51 componentes
- **PROXIMOS-PASSOS.md** - ESTE ARQUIVO
- **PROGRESSO-FINAL.md** - Resumo da sessão anterior
- **RESUMO-ATUAL.md** - Status com estatísticas

---

## 💡 Dicas para Continuar

1. **Leia primeiro**: `docs/PROGRESSO-FINAL.md` para contexto completo
2. **Valide Docker**: Sempre confirme que containers estão rodando
3. **Uma tarefa por vez**: Siga a ordem recomendada acima
4. **Não pule testes**: Implementar testes desde o início evita bugs
5. **Use os componentes**: Todos os 51 componentes estão em `@life/ui`
6. **Consulte stores**: Use os stores Zustand já criados
7. **API docs**: http://localhost:8080/docs mostra todas as rotas disponíveis

---

**Última sessão**: 12-13 horas de trabalho, 38% completo ✅
**Próxima meta**: TanStack Query + Services de API (4 horas) 🎯
