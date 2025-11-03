# Próximos Passos - Continuar de Onde Paramos

**Última Atualização**: 28 de Outubro de 2025
**Status Atual**: 80-85% da Fase 1 completo
**Próxima Tarefa**: Integrações (Google OAuth Real, Notifications, Biometria)

---

## 📍 ONDE ESTAMOS AGORA

### ✅ JÁ COMPLETADO (80-85%)

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

#### 5. TanStack Query Setup (100%) ✅

- ✅ QueryClient configurado em `lib/queryClient.ts`
- ✅ 25+ hooks customizados implementados
- ✅ useAuth (useUser, useLoginWithGoogle, useRefreshToken, useLogout)
- ✅ useProfile (useProfile, useUpdateCPF, useUpdateWhatsApp, useVerifyOTP)
- ✅ useDocuments (useDocuments, useUploadDocument, useDeleteDocument)
- ✅ useMargin (useMargin, useMarginHistory, useMarginPercentage)
- ✅ useSimulations (useSimulations, useCreateSimulation, useApproveSimulation)
- ✅ QueryClientProvider integrado no App.tsx
- ✅ Cache, retry logic e error handling configurados

#### 6. API Services (100%) ✅

- ✅ Axios client com interceptors (auth token, refresh automático)
- ✅ auth.service.ts (loginWithGoogle, refreshToken, logout, getMe)
- ✅ profile.service.ts (getProfile, updateCPF, updateWhatsApp, verifyOTP)
- ✅ documents.service.ts (getDocuments, uploadDocument, deleteDocument)
- ✅ margin.service.ts (getMargin, getHistory)
- ✅ simulations.service.ts (getSimulations, createSimulation, approveSimulation)
- ✅ Total: 21 funções implementadas

#### 7. Páginas/Screens (93.75% - 15/16) ✅

- ✅ Welcome.tsx - Login com Google OAuth
- ✅ Dashboard.tsx - Margem, simulações, documentos, quick actions
- ✅ NovaSimulacao.tsx - Form completo com validação
- ✅ DetalhesSimulacao.tsx - Detalhes + aceitar/cancelar
- ✅ Historico.tsx - Lista de simulações
- ✅ DetalhesMargem.tsx - Margem + gráfico histórico
- ✅ MeusDocumentos.tsx - Lista com status
- ✅ EnviarDocumento.tsx - Upload com progress
- ✅ Perfil.tsx - Perfil do usuário
- ✅ DadosPessoais.tsx - Editar CPF/WhatsApp
- ✅ SegurancaPrivacidade.tsx - Configurações
- ✅ Notificacoes.tsx - Lista de notificações
- ✅ AjudaSuporte.tsx - FAQ + suporte
- ✅ Index.tsx - Splash screen
- ✅ NotFound.tsx - 404
- ⏳ 1 página faltando (a definir)

---

## 🎯 PRÓXIMOS PASSOS (Ordem Recomendada)

### 1. ⏳ Integrações (PRÓXIMO - 2-3 horas)

**O que fazer**: Configurar integrações reais do app

#### A. Google OAuth Real (Expo AuthSession)

```typescript
// apps/mobile/src/screens/Welcome.tsx (linhas 16-19)
// Substituir placeholders por credenciais reais:
expoClientId: 'SEU_EXPO_CLIENT_ID',
iosClientId: 'SEU_IOS_CLIENT_ID.apps.googleusercontent.com',
androidClientId: 'SEU_ANDROID_CLIENT_ID.apps.googleusercontent.com',
webClientId: 'SEU_WEB_CLIENT_ID.apps.googleusercontent.com',
```

**Como obter**:

1. Criar projeto em [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google Sign-In API
3. Criar credenciais OAuth 2.0 para cada plataforma
4. Copiar Client IDs

#### B. Backend: Validar Token Real

```python
# services/api/app/api/routes/auth.py (linha 16)
# Substituir mock por validação real:
from google.oauth2 import id_token
from google.auth.transport import requests

decoded = id_token.verify_oauth2_token(
    request.id_token,
    requests.Request(),
    WEB_CLIENT_ID
)
email = decoded['email']
# ... criar/buscar usuário no BD
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

#### D. Biometria (expo-local-authentication)

```typescript
// apps/mobile/src/services/auth/biometric.ts
- hasHardwareAsync()
- isEnrolledAsync()
- authenticateAsync()
- Integrar em SegurancaPrivacidade.tsx
```

**Arquivos a criar/editar**:

- ✅ `apps/mobile/src/screens/Welcome.tsx` (substituir placeholders)
- ⏳ `services/api/app/api/routes/auth.py` (validar token real)
- ⏳ `apps/mobile/src/services/notifications/expo.ts`
- ⏳ `apps/mobile/src/services/auth/biometric.ts`

---

### 2. ~~Páginas (16 telas - 6-8 horas)~~ ✅ 15/16 COMPLETO

Todas as páginas estão implementadas e funcionais. Veja [PAGINAS-IMPLEMENTADAS.md](PAGINAS-IMPLEMENTADAS.md) para detalhes.

---

### 3. Testes (10-12 horas)

**Setup necessário**:

1. **Criar jest.config.js** na raiz do mobile
2. **Criar setupTests.ts**
3. **Instalar dependências** de teste (já no package.json)

#### Unit Tests (5-6h)

Para cada componente (~51):

```typescript
describe("ComponentName", () => {
  it("renders correctly", () => {});
  it("handles props", () => {});
  it("handles interactions", () => {});
  it("shows error state", () => {});
  it("is accessible", () => {});
});
```

Configuração:

- Jest + React Native Testing Library
- Mock de navegação
- Mock de API
- Coverage 80%+

#### Integration Tests (3-4h)

Para cada página (~15):

```typescript
describe("PageName Screen", () => {
  it("loads data", () => {});
  it("submits form", () => {});
  it("navigates correctly", () => {});
  it("handles errors", () => {});
});
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

| Fase                       | Tempo Estimado | Status           |
| -------------------------- | -------------- | ---------------- |
| ~~1. Infraestrutura~~      | ~~2-3h~~       | ✅ Completo      |
| ~~2. Componentes UI (51)~~ | ~~7-8h~~       | ✅ Completo      |
| ~~3. React Navigation~~    | ~~1h~~         | ✅ Completo      |
| ~~4. Zustand Stores (6)~~  | ~~1h~~         | ✅ Completo      |
| ~~5. TanStack Query~~      | ~~2h~~         | ✅ Completo      |
| ~~6. Services de API~~     | ~~2h~~         | ✅ Completo      |
| ~~7. Páginas (15/16)~~     | ~~6-8h~~       | ✅ ~94% Completo |
| 8. Integrações             | 2-3h           | ⏳ **PRÓXIMO**   |
| 9. Testes                  | 10-12h         | ⏳ Pendente      |
| 10. Storybook              | 4-5h           | ⏳ Pendente      |
| 11. CI/CD                  | 2h             | ⏳ Pendente      |

**Já completo**: 23-26 horas (80-85%) ✅
**Restante**: 18-22 horas (15-20%) ⏳
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

### Passo 3: Rodar o App Mobile

**Navegar para mobile e iniciar**:

```bash
cd apps/mobile
pnpm dev
```

**Após Expo DevTools abrir**:

- Pressione `w` para abrir no navegador (mais rápido)
- Pressione `a` para Android emulator (se tiver)
- Pressione `i` para iOS simulator (macOS apenas)
- Escaneie QR code com Expo Go app no smartphone

**Próximas tarefas** (após rodar):

1. Configurar Google OAuth credentials reais
2. Implementar Expo Notifications
3. Adicionar biometria
4. Escrever testes

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

- [x] TanStack Query configurado ✅
- [x] Services de API (Axios client + 6 services) ✅
- [ ] Google OAuth funcionando (credenciais reais) ⏳
- [x] Upload MinIO funcionando (presigned URLs implementado) ✅
- [ ] Expo Notifications funcionando (mock atual) ⏳
- [ ] Biometria implementada ⏳

### Frontend

- [x] 15/16 páginas implementadas ✅
- [x] Navegação conectada às páginas reais ✅
- [x] Forms com validação ✅
- [x] Loading/error states ✅
- [ ] Assets (icon, splash) - placeholders necessários ⏳

### Qualidade

- [ ] Unit tests (51 componentes, 80%+ coverage) ⏳
- [ ] Integration tests (15 páginas) ⏳
- [ ] E2E tests (Detox, fluxos críticos) ⏳
- [ ] Storybook com todos os componentes ⏳

### Deploy & CI

- [ ] GitHub Actions (lint, test, build) ⏳
- [ ] Builds iOS/Android funcionando ⏳
- [ ] App publicável nas stores ⏳

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

**Última atualização**: 28 de Outubro de 2025
**Progresso atual**: 23-26 horas de trabalho, 80-85% completo ✅
**Próxima meta**: Integrações (Google OAuth Real, Notifications, Biometria) (2-3 horas) 🎯
**Para testar agora**: `pnpm install` → Docker up → `pnpm dev` no mobile 🚀
