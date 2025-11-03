# Guia de Referência: Tamagui Setup para Expo

**Fonte**: https://tamagui.dev/docs
**Data**: 03/11/2025
**Projeto**: Life Digital

---

## 📦 Instalação Básica

### Pacotes Core

```bash
# Core (mínimo)
yarn add @tamagui/core

# UI Kit Completo (recomendado)
yarn add tamagui

# Configuração padrão
yarn add @tamagui/config
```

### Babel Plugin (Obrigatório para Expo)

```bash
yarn add @tamagui/babel-plugin
```

---

## ⚙️ Configuração

### 1. `tamagui.config.ts`

**Versão Simples (Recomendada - Oficial):**

```typescript
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui(defaultConfig);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
```

**IMPORTANTE**:

- Use `defaultConfig` (não `config`)
- Import `createTamagui` de `tamagui` (não `@tamagui/core`)
- Declare module em `tamagui` (não `@tamagui/core`)

### 2. `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === "development",
        },
      ],
      "react-native-reanimated/plugin", // deve ser o último
    ],
  };
};
```

### 3. `App.tsx`

```typescript
import { TamaguiProvider } from '@tamagui/core'
import config from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      {/* sua aplicação aqui */}
    </TamaguiProvider>
  )
}
```

---

## 🚀 Comandos Expo

### Primeira Execução (Obrigatório)

```bash
npx expo start -c  # -c limpa o cache
```

### Scripts Recomendados no package.json

```json
{
  "scripts": {
    "dev": "expo start -c",
    "start-native": "expo start -c",
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
}
```

---

## 📚 Estrutura de Imports

### Imports Corretos

```typescript
// ✅ CORRETO
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { config } from "@tamagui/config/v4";
import { Button, Input, Text } from "tamagui";

// ❌ ERRADO
import { config as defaultConfig } from "@tamagui/config/v3"; // v3 não existe!
```

---

## 🎯 Componentes Básicos

### Exemplo de Uso

```typescript
import { Button, YStack, XStack, Text } from 'tamagui'

export function MyComponent() {
  return (
    <YStack padding="$4" space="$2">
      <Text fontSize="$6">Hello World</Text>
      <Button theme="blue">Click Me</Button>
    </YStack>
  )
}
```

---

## 🔧 Troubleshooting

### Erro: "initialize is not a function"

**Causa**: Configuração incorreta do tamagui.config.ts
**Solução**: Use `@tamagui/config/v4` e `createTamagui(config)`

### Erro: "Unable to resolve @tamagui/..."

**Causa**: Pacotes faltando
**Solução**: Instale todos os pacotes necessários e rode `pnpm install`

### Cache do Metro não atualiza

**Solução**: Sempre use `expo start -c` ou `expo start --clear`

---

## 📋 Checklist de Setup

- [ ] Instalar `tamagui` e `@tamagui/config`
- [ ] Instalar `@tamagui/babel-plugin`
- [ ] Criar `tamagui.config.ts` com `@tamagui/config/v4`
- [ ] Configurar `babel.config.js` com o plugin
- [ ] Envolver App com `<TamaguiProvider>`
- [ ] Limpar cache do Metro: `expo start -c`
- [ ] Testar com componente básico

---

## 🔗 Links Úteis

- Documentação: https://tamagui.dev/docs
- GitHub: https://github.com/tamagui/tamagui
- Expo Guide: https://tamagui.dev/docs/guides/expo
- Config Docs: https://tamagui.dev/docs/core/configuration

---

**Última Atualização**: 03/11/2025
