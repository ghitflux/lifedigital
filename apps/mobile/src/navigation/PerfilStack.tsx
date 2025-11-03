import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import type { PerfilStackParamList } from "../types/navigation";
import { tokens } from "@life/tokens";
import PerfilScreen from "../screens/Perfil";
import DadosPessoaisScreen from "../screens/DadosPessoais";
import SegurancaPrivacidadeScreen from "../screens/SegurancaPrivacidade";
import NotificacoesScreen from "../screens/Notificacoes";
import AjudaSuporteScreen from "../screens/AjudaSuporte";

const Stack = createStackNavigator<PerfilStackParamList>();

export function PerfilStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.colors.card,
          borderBottomColor: tokens.colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: tokens.colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DadosPessoais"
        component={DadosPessoaisScreen}
        options={{ title: "Dados Pessoais" }}
      />
      <Stack.Screen
        name="SegurancaPrivacidade"
        component={SegurancaPrivacidadeScreen}
        options={{ title: "Seguranca e Privacidade" }}
      />
      <Stack.Screen
        name="Notificacoes"
        component={NotificacoesScreen}
        options={{ title: "Notificacoes" }}
      />
      <Stack.Screen
        name="AjudaSuporte"
        component={AjudaSuporteScreen}
        options={{ title: "Ajuda e Suporte" }}
      />
    </Stack.Navigator>
  );
}
