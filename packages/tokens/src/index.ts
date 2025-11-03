export const colors = {
  bg: "#0B0F1A",
  card: "#0F1626",
  surface: "#121A2B",
  text: "#E8ECF8",
  muted: "#A7B0C2",
  border: "rgba(255,255,255,.08)",
  primary: "#2563EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
} as const;
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;
export const typography = {
  h1: { size: 32, weight: "700", lh: 38 },
  h2: { size: 24, weight: "600", lh: 30 },
  h3: { size: 20, weight: "600", lh: 26 },
  body: { size: 16, weight: "400", lh: 22 },
  caption: { size: 14, weight: "400", lh: 18 },
  small: { size: 12, weight: "400", lh: 16 },
} as const;
export const tokens = { colors, radius, spacing, typography };
export type Tokens = typeof tokens;
