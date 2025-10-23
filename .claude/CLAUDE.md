# Life Digital - Memória de Contexto

**Projeto**: Life Digital - Crédito Consignado
**Stack**: React Native + Expo + FastAPI + PostgreSQL
**Última Atualização**: 23/10/2025

---

## 📊 Status Atual do Projeto

**Progresso da Fase 1**: 62% completo

### ✅ Completo (8/13 categorias)
1. **Infraestrutura** - Monorepo com pnpm + Turborepo, Docker Compose (PostgreSQL, Redis, MinIO, ClamAV)
2. **Tamagui Setup** - Configurado com tokens dark customizados
3. **Componentes UI** - 51 componentes completos (primitivos, layout, feedback, forms, dialogs, advanced)
4. **React Navigation** - RootNavigator + AuthStack + AppTabs + 4 Stack Navigators
5. **Zustand Stores** - 6 stores (auth, profile, documents, margin, simulations, notifications)
6. **TanStack Query** - 25+ hooks (useAuth, useProfile, useDocuments, useMargin, useSimulations)
7. **API Services** - 21 funções (Axios client + 5 services)
8. **Páginas** - 16 telas completas

### ⏳ Pendente (5/13 categorias)
- Integrações (Google OAuth real, Expo Notifications, Biometria)
- Testes (Unit, Integration, E2E)
- Storybook
- CI/CD
- Documentação final

---

## 🏗️ Arquitetura

```
lifedigital/
├── apps/mobile/              # App Expo/React Native
│   ├── src/
│   │   ├── screens/          # 16 páginas ✅
│   │   ├── navigation/       # React Navigation ✅
│   │   ├── stores/           # Zustand stores ✅
│   │   ├── lib/
│   │   │   ├── hooks/        # TanStack Query hooks ✅
│   │   │   └── queryClient.ts ✅
│   │   ├── services/api/     # API services ✅
│   │   └── types/            # TypeScript types ✅
│   └── App.tsx               ✅
├── packages/
│   ├── tokens/               # Design tokens ✅
│   └── ui/                   # 51 componentes ✅
├── services/api/             # Backend FastAPI ✅
├── infra/docker/             # Docker Compose ✅
└── docs/                     # Documentação ✅
```

---

## 🔑 Informações Importantes

### Backend API
- **URL Base**: http://localhost:8080
- **Swagger Docs**: http://localhost:8080/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **MinIO**: localhost:9000 (console: 9001)

### Componentes UI (51 total)
- Primitivos: Button, Input, Label, Textarea, Separator
- Layout: Card, AspectRatio, ScrollArea, ResizablePanel
- Feedback: Alert, Badge, Skeleton, Progress, Toast, Toaster, Sonner, useToast
- Navegação: MobileNav, Tabs, Breadcrumb, Pagination, NavigationMenu, Menubar, Sidebar
- Formulários: Checkbox, RadioGroup, Switch, Slider, Select, InputOTP, Form
- Dialogs: Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, DropdownMenu, ContextMenu, Command
- Avançados: Accordion, Collapsible, Carousel, Calendar, Table, Toggle, ToggleGroup, Chart, StatCard, Avatar

### TanStack Query Hooks (25+)
- Auth: useUser, useLoginWithGoogle, useRefreshToken, useLogout
- Profile: useProfile, useUpdateCPF, useUpdateWhatsApp, useVerifyOTP, useUpdateProfile
- Documents: useDocuments, useDocument, useGetPresignedUrl, useUploadDocument, useDeleteDocument
- Margin: useMargin, useMarginHistory, useMarginPercentage, useMarginStatus
- Simulations: useSimulations, useSimulation, useCreateSimulation, useApproveSimulation, useCancelSimulation, usePendingSimulations, useApprovedSimulations

### Páginas (16 total)
1. Index - Splash screen
2. Welcome - Login com Google
3. Dashboard - Tela principal
4. NovaSimulacao - Criar simulação
5. DetalhesSimulacao - Ver simulação
6. Historico - Histórico de simulações
7. DetalhesMargem - Margem + gráfico
8. MeusDocumentos - Lista documentos
9. EnviarDocumento - Upload
10. Perfil - Perfil do usuário
11. DadosPessoais - Editar CPF/WhatsApp
12. SegurancaPrivacidade - Configurações
13. Notificacoes - Lista notificações
14. AjudaSuporte - Central de ajuda
15. NotFound - 404

---

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Iniciar Docker
```bash
cd infra/docker
docker-compose up -d
```

### 3. Rodar Backend
```bash
cd services/api
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### 4. Rodar App Mobile
```bash
cd apps/mobile
pnpm dev
```

---

## 📝 Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Rodar app mobile
cd apps/mobile && pnpm dev

# Build packages
pnpm build

# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Testes
pnpm test

# Docker
docker-compose up -d          # Subir serviços
docker-compose down           # Parar serviços
docker-compose logs -f api    # Ver logs da API
```

---

## 🔐 Configurações Necessárias

### Google OAuth (Pendente)
1. Criar projeto no Google Cloud Console
2. Habilitar Google Sign-In API
3. Criar credenciais OAuth 2.0
4. Adicionar em `apps/mobile/src/screens/Welcome.tsx`:
   - expoClientId
   - iosClientId
   - androidClientId
   - webClientId

### MinIO (Configurado)
- Access Key: minioadmin
- Secret Key: minioadmin
- Bucket: documents

### PostgreSQL (Configurado)
- Host: localhost
- Port: 5432
- Database: lifedigital
- User: postgres
- Password: postgres

---

## 📚 Documentação Disponível

1. [PROXIMOS-PASSOS.md](../docs/PROXIMOS-PASSOS.md) - Roadmap
2. [PROGRESSO-FINAL.md](../docs/PROGRESSO-FINAL.md) - Status geral
3. [FASE1-PROGRESSO.md](../docs/FASE1-PROGRESSO.md) - Detalhes Fase 1
4. [TANSTACK-QUERY-SETUP.md](../docs/TANSTACK-QUERY-SETUP.md) - Hooks TanStack Query
5. [API-SERVICES.md](../docs/API-SERVICES.md) - Services da API
6. [PAGINAS-IMPLEMENTADAS.md](../docs/PAGINAS-IMPLEMENTADAS.md) - 16 páginas
7. [COMPONENTES-IMPLEMENTADOS.md](../docs/COMPONENTES-IMPLEMENTADOS.md) - 51 componentes
8. [ADR-2025-Stack.md](../docs/ADR-2025-Stack.md) - Decisões de arquitetura

---

## 🎯 Próximos Passos (38% restante)

### 1. Integrações (~3h)
- [ ] Configurar Google OAuth real
- [ ] Setup Expo Notifications
- [ ] Implementar biometria (expo-local-authentication)
- [ ] Configurar deep linking

### 2. Testes (~10h)
- [ ] Unit tests para hooks (Jest + React Testing Library)
- [ ] Integration tests para páginas
- [ ] E2E tests com Detox
- [ ] Coverage target: 80%+

### 3. Storybook (~5h)
- [ ] Setup @storybook/react-native
- [ ] Stories para 51 componentes
- [ ] Controles interativos
- [ ] Addon de acessibilidade

### 4. CI/CD (~2h)
- [ ] GitHub Actions workflows
- [ ] Lint, typecheck, tests
- [ ] Build validation

### 5. Documentação Final (~1h)
- [ ] README principal
- [ ] Contributing guidelines
- [ ] API documentation
- [ ] Deployment guide

---

## 💡 Padrões e Convenções

### Código
- TypeScript strict mode
- JSDoc completo
- React.forwardRef em componentes
- Acessibilidade em todos os componentes
- Tokens em vez de hardcoded values

### Commits
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- refactor: Refatoração
- test: Testes
- chore: Tarefas gerais

### Nomenclatura
- Componentes: PascalCase
- Hooks: camelCase com prefixo "use"
- Services: camelCase com sufixo "Service"
- Types: PascalCase com sufixo "Type" ou interface

---

## 🐛 Issues Conhecidos

1. **Google OAuth**: Credenciais placeholder (precisa configurar no Google Cloud)
2. **Notificações**: Mock data (precisa integrar Expo Notifications)
3. **Biometria**: Não implementada (precisa expo-local-authentication)
4. **Testes**: Não implementados (0% coverage)

---

## 📊 Estatísticas

- **Arquivos criados**: ~120 arquivos
- **Linhas de código**: ~14.000+ linhas
- **Componentes**: 51
- **Páginas**: 16
- **Hooks**: 25+
- **Services**: 21 funções
- **Stores**: 6
- **Tempo investido**: ~15-18 horas

---

**Última atualização**: 23/10/2025
**Status**: 62% da Fase 1 completo
**Próximo milestone**: Integrações (Google OAuth, Notifications)
