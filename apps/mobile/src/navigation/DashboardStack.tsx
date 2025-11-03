import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import type { DashboardStackParamList } from "../types/navigation";
import { tokens } from "@life/tokens";
import DashboardScreen from "../screens/Dashboard";
import NovaSimulacaoScreen from "../screens/NovaSimulacao";
import DetalhesSimulacaoScreen from "../screens/DetalhesSimulacao";
import HistoricoScreen from "../screens/Historico";

const Stack = createStackNavigator<DashboardStackParamList>();

export function DashboardStack() {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NovaSimulacao"
        component={NovaSimulacaoScreen}
        options={{ title: "Nova Simulacao" }}
      />
      <Stack.Screen
        name="DetalhesSimulacao"
        component={DetalhesSimulacaoScreen}
        options={{ title: "Detalhes" }}
      />
      <Stack.Screen
        name="Historico"
        component={HistoricoScreen}
        options={{ title: "Historico" }}
      />
    </Stack.Navigator>
  );
}
