/**
 * Navigation Types
 *
 * TypeScript types for React Navigation
 */

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Root Navigator (before auth check)
export type RootStackParamList = {
  Splash: undefined;
  Auth: AuthStackParamList;
  App: NavigatorScreenParams<AppTabParamList>;
};

// Auth Stack (Login flow)
export type AuthStackParamList = {
  Welcome: undefined;
};

// App Tabs (Main app)
export type AppTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  MargemTab: NavigatorScreenParams<MargemStackParamList>;
  DocumentosTab: NavigatorScreenParams<DocumentosStackParamList>;
  PerfilTab: NavigatorScreenParams<PerfilStackParamList>;
};

// Dashboard Stack
export type DashboardStackParamList = {
  Dashboard: undefined;
  NovaSimulacao: undefined;
  DetalhesSimulacao: { id: string };
  Historico: undefined;
};

// Margem Stack
export type MargemStackParamList = {
  DetalhesMargem: undefined;
};

// Documentos Stack
export type DocumentosStackParamList = {
  MeusDocumentos: undefined;
  EnviarDocumento: undefined;
};

// Perfil Stack
export type PerfilStackParamList = {
  Perfil: undefined;
  DadosPessoais: undefined;
  SegurancaPrivacidade: undefined;
  Notificacoes: undefined;
  AjudaSuporte: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

export type AppTabScreenProps<T extends keyof AppTabParamList> =
  BottomTabScreenProps<AppTabParamList, T>;

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> =
  StackScreenProps<DashboardStackParamList, T>;

export type MargemStackScreenProps<T extends keyof MargemStackParamList> =
  StackScreenProps<MargemStackParamList, T>;

export type DocumentosStackScreenProps<
  T extends keyof DocumentosStackParamList,
> = StackScreenProps<DocumentosStackParamList, T>;

export type PerfilStackScreenProps<T extends keyof PerfilStackParamList> =
  StackScreenProps<PerfilStackParamList, T>;

// Navigation Props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
