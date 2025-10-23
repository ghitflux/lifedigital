# @life/ui

Biblioteca de componentes React Native construída com Tamagui para o app Life Digital.

## 📦 Componentes Disponíveis (51 total)

### Primitivos (5)
- **Button** - Botão versátil com 7 variants e loading state
- **Input** - Campo de texto com ícones e validação
- **Label** - Label para formulários com required indicator
- **Textarea** - Campo de texto multilinhas com contador
- **Separator** - Divisor horizontal/vertical

### Layout (4)
- **Card** - Container com header, content e footer
- **AspectRatio** - Mantém proporções de conteúdo
- **ScrollArea** - Área scrollável customizável
- **ResizablePanel** - Painel redimensionável por drag

### Feedback (8)
- **Alert** - Mensagens de alerta com 5 variants
- **Badge** - Label pequeno para status/contagens
- **Skeleton** - Loading placeholder animado
- **Progress** - Barra de progresso determinate/indeterminate
- **Toast** - Notificação toast individual
- **Toaster** - Container para toasts
- **Sonner** - API simplificada para toasts
- **useToast** - Hook para gerenciar toasts

### Navegação (7)
- **MobileNav** - Bottom tab navigation
- **Tabs** - Tabs com variants default/pills
- **Breadcrumb** - Navegação breadcrumb
- **Pagination** - Paginação com números
- **NavigationMenu** - Menu dropdown
- **Menubar** - Menu bar superior
- **Sidebar** - Navegação lateral colapsável

### Formulários (7)
- **Checkbox** - Checkbox com label
- **RadioGroup** - Grupo de radio buttons
- **Switch** - Toggle switch animado
- **Slider** - Slider de valores com gesture
- **Select** - Dropdown de seleção
- **InputOTP** - Input de código OTP
- **Form** - Context API para formulários

### Dialogs/Overlays (10)
- **Dialog** - Modal dialog com overlay
- **AlertDialog** - Dialog de confirmação
- **Sheet** - Bottom sheet slide-up
- **Drawer** - Side drawer
- **Popover** - Conteúdo flutuante
- **HoverCard** - Card em hover/press
- **Tooltip** - Tooltip em hover/press
- **DropdownMenu** - Menu dropdown
- **ContextMenu** - Menu de contexto (long-press)
- **Command** - Command palette (Cmd+K)

### Avançados (10)
- **Accordion** - Seções colapsáveis
- **Collapsible** - Seção colapsável única
- **Carousel** - Carrossel de imagens/conteúdo
- **Calendar** - Seletor de data
- **Table** - Tabela de dados
- **Toggle** - Toggle button
- **ToggleGroup** - Grupo de toggle buttons
- **Chart** - Gráficos simples (bar/line)
- **StatCard** - Card de estatísticas com trend
- **Avatar** - Avatar de usuário com fallback

## 🚀 Instalação

```bash
pnpm install @life/ui @life/tokens
```

## 📖 Uso Básico

```tsx
import { Button, Input, Card, CardContent, Toast } from '@life/ui'

function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Input placeholder="Digite algo..." />
        <Button variant="primary" onPress={() => {}}>
          Salvar
        </Button>
      </CardContent>
    </Card>
  )
}
```

## 🎨 Tokens

Todos os componentes usam tokens do `@life/tokens`:

```tsx
import { tokens } from '@life/ui'

const { colors, spacing, radius, typography } = tokens

// Cores
colors.bg       // #0B0F1A
colors.primary  // #2563EB
colors.success  // #10B981

// Spacing
spacing.xs  // 4
spacing.md  // 16
spacing.xl  // 32

// Radius
radius.md    // 8
radius.full  // 9999

// Typography
typography.h1    // { size: 32, weight: '700', lh: 38 }
typography.body  // { size: 16, weight: '400', lh: 22 }
```

## 🎯 Exemplos

### Toast Notifications

```tsx
import { useToast, Toaster } from '@life/ui'

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  )
}

function MyComponent() {
  const { toast } = useToast()

  const handleSave = () => {
    toast.success("Salvo!", "Suas alterações foram salvas")
  }

  return <Button onPress={handleSave}>Salvar</Button>
}
```

### Forms

```tsx
import { Form, FormField, Input, Button } from '@life/ui'

function LoginForm() {
  return (
    <Form onSubmit={(values) => console.log(values)}>
      <FormField name="email" label="Email" required>
        {({ value, onChange, error }) => (
          <Input
            value={value}
            onChangeText={onChange}
            error={!!error}
            placeholder="seu@email.com"
          />
        )}
      </FormField>

      <Button type="submit">Entrar</Button>
    </Form>
  )
}
```

### Dialogs

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Button } from '@life/ui'

function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Título</DialogTitle>
        </DialogHeader>
        <Text>Conteúdo do dialog</Text>
      </DialogContent>
    </Dialog>
  )
}
```

## 🔧 Dependências

- `tamagui` - UI framework
- `@tamagui/lucide-icons` - Ícones
- `react-native-reanimated` - Animações
- `react-native-gesture-handler` - Gestures
- `react-native-svg` - SVG support
- `zustand` - State management (toast)

## 📚 Documentação Completa

Ver [`/docs/COMPONENTES-IMPLEMENTADOS.md`](../../docs/COMPONENTES-IMPLEMENTADOS.md) para documentação detalhada de cada componente.

## 🎨 Storybook

Para ver todos os componentes interativamente:

```bash
pnpm --filter @life/mobile storybook
```

## 🧪 Testes

```bash
# Unit tests
pnpm test

# Com coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 📝 Convenções

- Todos os componentes usam `React.forwardRef`
- Props interfaces são exportadas
- JSDoc completo em todos os componentes
- Acessibilidade built-in
- Animações com Reanimated
- Gestures com Gesture Handler

## 🤝 Contribuindo

Ver [`/docs/CONTRIBUTING.md`](../../docs/CONTRIBUTING.md)

## 📄 Licença

Proprietário - Life Digital
