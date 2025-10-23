import { config as defaultConfig } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'
import { tokens } from './index'

// Customizar tokens do Tamagui com os nossos valores
const customTokens = {
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    // Dark theme colors (overrides)
    bg: tokens.colors.bg,
    card: tokens.colors.card,
    surface: tokens.colors.surface,
    text: tokens.colors.text,
    muted: tokens.colors.muted,
    border: tokens.colors.border,
    primary: tokens.colors.primary,
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    danger: tokens.colors.danger,
  },
  space: {
    ...defaultConfig.tokens.space,
    xs: tokens.spacing.xs,
    sm: tokens.spacing.sm,
    md: tokens.spacing.md,
    lg: tokens.spacing.lg,
    xl: tokens.spacing.xl,
    '2xl': tokens.spacing['2xl'],
    '3xl': tokens.spacing['3xl'],
  },
  radius: {
    ...defaultConfig.tokens.radius,
    sm: tokens.radius.sm,
    md: tokens.radius.md,
    lg: tokens.radius.lg,
    xl: tokens.radius.xl,
    full: tokens.radius.full,
  },
  size: defaultConfig.tokens.size,
  zIndex: defaultConfig.tokens.zIndex,
}

// Theme customizado
const customThemes = {
  light: {
    background: tokens.colors.bg,
    backgroundHover: tokens.colors.card,
    backgroundPress: tokens.colors.surface,
    backgroundFocus: tokens.colors.card,
    borderColor: tokens.colors.border,
    borderColorHover: tokens.colors.muted,
    borderColorFocus: tokens.colors.primary,
    color: tokens.colors.text,
    colorHover: tokens.colors.text,
    colorPress: tokens.colors.muted,
    colorFocus: tokens.colors.text,
    primary: tokens.colors.primary,
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    danger: tokens.colors.danger,
  },
  dark: {
    background: tokens.colors.bg,
    backgroundHover: tokens.colors.card,
    backgroundPress: tokens.colors.surface,
    backgroundFocus: tokens.colors.card,
    borderColor: tokens.colors.border,
    borderColorHover: tokens.colors.muted,
    borderColorFocus: tokens.colors.primary,
    color: tokens.colors.text,
    colorHover: tokens.colors.text,
    colorPress: tokens.colors.muted,
    colorFocus: tokens.colors.text,
    primary: tokens.colors.primary,
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    danger: tokens.colors.danger,
  },
}

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens: customTokens,
  themes: customThemes,
  defaultTheme: 'dark',
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
