import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import type { DocumentosStackParamList } from "../types/navigation";
import { tokens } from "@life/tokens";
import MeusDocumentosScreen from "../screens/MeusDocumentos";
import EnviarDocumentoScreen from "../screens/EnviarDocumento";

const Stack = createStackNavigator<DocumentosStackParamList>();

export function DocumentosStack() {
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
        name="MeusDocumentos"
        component={MeusDocumentosScreen}
        options={{ title: "Documentos" }}
      />
      <Stack.Screen
        name="EnviarDocumento"
        component={EnviarDocumentoScreen}
        options={{ title: "Enviar Documento" }}
      />
    </Stack.Navigator>
  );
}
