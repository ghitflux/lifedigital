import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import type { MargemStackParamList } from "../types/navigation";
import { tokens } from "@life/tokens";
import DetalhesMargemScreen from "../screens/DetalhesMargem";

const Stack = createStackNavigator<MargemStackParamList>();

export function MargemStack() {
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
        name="DetalhesMargem"
        component={DetalhesMargemScreen}
        options={{ title: "Margem Disponivel" }}
      />
    </Stack.Navigator>
  );
}
