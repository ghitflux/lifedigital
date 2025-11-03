import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { YStack, Text } from "tamagui";
import type { RootStackParamList } from "../types/navigation";
import { useAuthStore } from "../stores/authStore";
import { AuthStack } from "./AuthStack";
import { AppTabs } from "./AppTabs";

const Stack = createStackNavigator<RootStackParamList>();

function SplashScreen() {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$bg"
    >
      <Text fontSize={32} fontWeight="700" color="$primary">
        Life Digital
      </Text>
      <Text fontSize={14} color="$muted" marginTop="$sm">
        Carregando...
      </Text>
    </YStack>
  );
}

const linking = {
  prefixes: ["lifedigital://", "https://lifedigital.app"],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: "welcome",
        },
      },
      App: {
        screens: {
          DashboardTab: {
            screens: {
              Dashboard: "dashboard",
              NovaSimulacao: "simulacao/nova",
              DetalhesSimulacao: "simulacao/:id",
              Historico: "historico",
            },
          },
          MargemTab: {
            screens: {
              DetalhesMargem: "margem",
            },
          },
          DocumentosTab: {
            screens: {
              MeusDocumentos: "documentos",
              EnviarDocumento: "documentos/enviar",
            },
          },
          PerfilTab: {
            screens: {
              Perfil: "perfil",
              DadosPessoais: "perfil/dados",
              SegurancaPrivacidade: "perfil/seguranca",
              Notificacoes: "perfil/notificacoes",
              AjudaSuporte: "perfil/ajuda",
            },
          },
        },
      },
    },
  },
};

export function RootNavigator() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          cardStyle: { backgroundColor: "transparent" },
        }}
      >
        {!hasHydrated ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
