# Componentes UI - Documentação de Implementação

## Estrutura de Diretórios

```
packages/ui/src/
├── components/
│   ├── primitives/     ✅ 5/5 componentes
│   ├── layout/         ✅ 4/4 componentes
│   ├── feedback/       ✅ 8/8 componentes
│   ├── navigation/     ✅ 7/7 componentes
│   ├── forms/          ✅ 7/7 componentes
│   ├── dialogs/        🔄 0/10 componentes
│   └── advanced/       ⏳ 0/9 componentes
├── hooks/
│   └── use-toast.ts    ✅
└── utils/              ⏳
```

---

## ✅ Primitivos (5 componentes)

### 1. Button
**Arquivo**: `components/primitives/button.tsx`
**Variantes**: default, primary, secondary, outline, ghost, danger, success
**Tamanhos**: sm (32px), md (40px), lg (48px)
**Features**:
- Loading state com spinner
- Icons (before/after)
- Full width
- Pressable com scale animation
- Acessibilidade completa

**Exemplo de uso**:
```tsx
<Button variant="primary" size="lg" loading>
  Salvar
</Button>
```

### 2. Input
**Arquivo**: `components/primitives/input.tsx`
**Features**:
- Left/right icons
- Error state
- Error message display
- Helper text
- Full width
- Focus styles

**Exemplo de uso**:
```tsx
<Input
  leftIcon={<Mail size={20} />}
  placeholder="Email"
  error={hasError}
  errorMessage="Email inválido"
/>
```

### 3. Label
**Arquivo**: `components/primitives/label.tsx`
**Features**:
- Required indicator (*)
- Disabled state
- 3 tamanhos

**Exemplo de uso**:
```tsx
<Label htmlFor="email" required>
  Email Address
</Label>
```

### 4. Textarea
**Arquivo**: `components/primitives/textarea.tsx`
**Features**:
- Character count
- Max length
- Auto resize
- Min/max rows
- Error states

**Exemplo de uso**:
```tsx
<Textarea
  maxLength={500}
  showCount
  autoResize
  minRows={3}
  maxRows={10}
/>
```

### 5. Separator
**Arquivo**: `components/primitives/separator.tsx`
**Orientações**: horizontal, vertical
**Features**:
- Custom thickness
- Custom color

---

## ✅ Layout (4 componentes)

### 1. Card
**Arquivo**: `components/layout/card.tsx`
**Sub-componentes**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
**Variantes**: default, elevated, outlined
**Padding**: none, sm, md, lg

**Exemplo de uso**:
```tsx
<Card variant="elevated">
  <CardHeader divided>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter justify="end">
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### 2. AspectRatio
**Arquivo**: `components/layout/aspect-ratio.tsx`
**Ratios comuns**: 16/9, 4/3, 1/1
**Uso**: Manter proporções de imagens/vídeos

### 3. ScrollArea
**Arquivo**: `components/layout/scroll-area.tsx`
**Features**:
- Horizontal/vertical scroll
- Hide scrollbar option
- Max height

### 4. ResizablePanel
**Arquivo**: `components/layout/resizable.tsx`
**Features**:
- Drag to resize
- Min/max size constraints
- Horizontal/vertical direction
- Gesture handler integration

---

## ✅ Feedback (8 componentes)

### 1. Alert
**Arquivo**: `components/feedback/alert.tsx`
**Variantes**: default, info, success, warning, danger
**Features**:
- Title + description
- Custom icons
- Dismissible
- Auto icons por variant

### 2. Badge
**Arquivo**: `components/feedback/badge.tsx`
**Variantes**: default, primary, secondary, success, warning, danger, outline
**Features**:
- Dot indicator
- 3 tamanhos

### 3. Skeleton
**Arquivo**: `components/feedback/skeleton.tsx`
**Variantes**: rectangular, circular, text
**Features**:
- Shimmer animation (pulse)
- Multiple lines support
- Animated with Reanimated

### 4. Progress
**Arquivo**: `components/feedback/progress.tsx`
**Modos**: determinate, indeterminate
**Features**:
- Show percentage label
- 5 color variants
- Smooth animations

### 5-7. Toast System
**Arquivos**:
- `components/feedback/toast.tsx` - Individual toast
- `components/feedback/toaster.tsx` - Container
- `hooks/use-toast.ts` - Hook Zustand

**Features**:
- Swipe to dismiss
- Auto dismiss
- Position configurável (6 posições)
- Max toasts limit
- Queue management
- Animated enter/exit

**Exemplo de uso**:
```tsx
const { toast } = useToast()

toast.success("Salvo!", "Suas alterações foram salvas")
toast.error("Erro", "Algo deu errado")
```

### 8. Sonner
**Arquivo**: `components/feedback/sonner.tsx`
**Tipo**: API simplificada para toasts
**Features**:
- Singleton instance
- Convenience methods
- Provider component

---

## ✅ Navegação (7 componentes)

### 1. MobileNav
**Arquivo**: `components/navigation/MobileNav.tsx`
**Uso**: Bottom tab navigation
**Features**:
- Active state highlighting
- Icon + label
- iOS safe area padding

### 2. Tabs
**Arquivo**: `components/navigation/tabs.tsx`
**Variantes**: default (underline), pills
**Features**:
- Controlled/uncontrolled
- Content por tab

### 3. Breadcrumb
**Arquivo**: `components/navigation/breadcrumb.tsx`
**Features**:
- Custom separator
- Clickable items
- Current page highlight

### 4. Pagination
**Arquivo**: `components/navigation/pagination.tsx`
**Features**:
- Page numbers
- Prev/next buttons
- Ellipsis for many pages
- Edge pages option

### 5. NavigationMenu
**Arquivo**: `components/navigation/navigation-menu.tsx`
**Features**:
- Dropdown menus
- Nested items
- Hover/click to open

### 6. Menubar
**Arquivo**: `components/navigation/menubar.tsx`
**Uso**: Top menu bar
**Features**:
- Icon support
- Dropdown items
- Keyboard shortcuts display

### 7. Sidebar
**Arquivo**: `components/navigation/sidebar.tsx`
**Features**:
- Collapsible
- Active item highlight
- Icon + label
- Custom width

---

## ✅ Formulários (7 componentes)

### 1. Checkbox
**Arquivo**: `components/forms/checkbox.tsx`
**Features**:
- Label support
- Disabled state
- Error state
- Checkmark icon

### 2. RadioGroup
**Arquivo**: `components/forms/radio-group.tsx`
**Features**:
- Vertical/horizontal layout
- Disabled options
- Single selection

### 3. Switch
**Arquivo**: `components/forms/switch.tsx`
**Features**:
- Animated toggle
- Label support
- Disabled state
- Spring animation

### 4. Slider
**Arquivo**: `components/forms/slider.tsx`
**Features**:
- Min/max/step
- Show value
- Gesture control
- Thumb indicator

### 5. Select
**Arquivo**: `components/forms/select.tsx`
**Features**:
- Dropdown list
- Disabled options
- Check icon on selected
- Placeholder support

### 6. InputOTP
**Arquivo**: `components/forms/input-otp.tsx`
**Features**:
- 6 digits (configurável)
- Auto-focus next
- Backspace navigation
- Number keyboard

### 7. Form
**Arquivo**: `components/forms/form.tsx`
**Sub-componentes**: Form, FormField
**Features**:
- Context API
- Field validation
- Error display
- Auto clear errors
- Required indicator

**Exemplo de uso**:
```tsx
<Form initialValues={{}} onSubmit={handleSubmit}>
  <FormField name="email" label="Email" required>
    {({ value, onChange, error }) => (
      <Input value={value} onChangeText={onChange} error={!!error} />
    )}
  </FormField>
</Form>
```

---

## 🔄 Em Desenvolvimento

### Dialogs/Overlays (10 componentes - Próximos)
1. Dialog - Modal dialog com overlay
2. AlertDialog - Confirmation dialog
3. Sheet - Bottom sheet slide-up
4. Drawer - Side drawer
5. Popover - Floating content
6. HoverCard - Card on hover
7. Tooltip - Small hint on hover
8. DropdownMenu - Menu dropdown
9. ContextMenu - Right-click menu
10. Command - Command palette (Cmd+K)

### Avançados (9 componentes - Depois)
1. Accordion - Collapsible sections
2. Collapsible - Single collapsible
3. Carousel - Image/content carousel
4. Calendar - Date picker
5. Table - Data table
6. Toggle/ToggleGroup - Toggle buttons
7. Chart - Simple charts
8. StatCard - Statistics card
9. Avatar - User avatar with fallback

---

## 📊 Padrões de Implementação

### Estrutura de Arquivo
```tsx
/**
 * ComponentName Component
 *
 * Description
 *
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */

import React from 'react'
import { styled } from 'tamagui'

export interface ComponentNameProps {
  // Props with JSDoc
}

const StyledComponent = styled(TamaguiComponent, {
  // Base styles
  variants: {
    // Variants
  }
})

export const ComponentName = React.forwardRef<HTMLElement, ComponentNameProps>(
  (props, ref) => {
    return <StyledComponent ref={ref} {...props} />
  }
)

ComponentName.displayName = 'ComponentName'
```

### Convenções
- ✅ Sempre usar React.forwardRef
- ✅ Sempre definir displayName
- ✅ Props interface exportada
- ✅ JSDoc completo
- ✅ Exemplo de uso
- ✅ Acessibilidade (accessible, accessibilityRole)
- ✅ Variants via styled()
- ✅ Animações com Reanimated quando necessário
- ✅ Gesture Handler para interações complexas

### Tokens Usage
- ✅ Cores: `$bg`, `$card`, `$primary`, etc.
- ✅ Spacing: `$xs`, `$sm`, `$md`, `$lg`, etc.
- ✅ Radius: `$sm`, `$md`, `$lg`, `$full`
- ✅ Nunca hardcode de valores

---

## 🔗 Dependências por Feature

### Animações
- `react-native-reanimated` - Core animations
- `withSpring`, `withTiming` - Animation helpers
- `useAnimatedStyle`, `useSharedValue` - Hooks

### Gestures
- `react-native-gesture-handler` - Touch gestures
- `Gesture.Pan()`, `Gesture.Tap()` - Gesture types
- `GestureDetector` - Wrapper component

### Icons
- `@tamagui/lucide-icons` - Icon library
- 1000+ icons disponíveis

### State
- `zustand` - Toast state management
- Context API - Form state

### Tamagui
- `styled()` - Styled components
- `YStack`, `XStack` - Layout primitives
- `Text`, `Circle`, etc. - Base components
