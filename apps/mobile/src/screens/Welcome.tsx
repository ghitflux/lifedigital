import React, { useState } from "react";
import { Alert as RNAlert } from "react-native";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Button, Alert } from "@life/ui";
import { useLoginWithGoogle } from "../lib/hooks";

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const loginWithGoogle = useLoginWithGoogle();
  const [error, setError] = useState<string | null>(null);

  const [_request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      }
    } else if (response?.type === "error") {
      setError("Erro ao autenticar com Google. Tente novamente.");
    }
  }, [response]);

  async function handleGoogleLogin(idToken: string) {
    try {
      setError(null);
      await loginWithGoogle.mutateAsync({ idToken });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao fazer login. Tente novamente.");
    }
  }

  async function handlePressGoogleLogin() {
    try {
      await promptAsync();
    } catch (err) {
      console.error("Erro ao abrir Google OAuth:", err);
      RNAlert.alert("Erro", "Nao foi possivel abrir o login do Google.");
    }
  }

  return (
    <ScrollView flex={1} backgroundColor="$bg">
      <YStack
        flex={1}
        padding="$6"
        gap="$6"
        justifyContent="center"
        minHeight="100%"
      >
        <YStack gap="$2" alignItems="center">
          <Text
            fontSize={48}
            fontWeight="bold"
            color="$primary"
            textAlign="center"
          >
            Life Digital
          </Text>
          <Text fontSize={18} color="$text" textAlign="center">
            Credito Consignado Simplificado
          </Text>
        </YStack>

        <YStack gap="$4" marginTop="$8">
          <BenefitItem
            title="Taxas baixas"
            description="As menores taxas do mercado para credito consignado"
          />
          <BenefitItem
            title="100% digital"
            description="Simule e contrate totalmente online, sem burocracia"
          />
          <BenefitItem
            title="Seguro e rapido"
            description="Processo seguro com aprovacao em ate 24 horas"
          />
        </YStack>

        {error && (
          <Alert variant="danger" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <YStack gap="$3" marginTop="$8">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handlePressGoogleLogin}
            loading={loginWithGoogle.isPending}
          >
            Entrar com Google
          </Button>

          <Text fontSize={12} color="$muted" textAlign="center">
            Ao continuar, voce concorda com nossos{" "}
            <Text color="$primary">Termos de Uso</Text> e{" "}
            <Text color="$primary">Politica de Privacidade</Text>
          </Text>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

interface BenefitItemProps {
  title: string;
  description: string;
}

function BenefitItem({ title, description }: BenefitItemProps) {
  return (
    <XStack gap="$3" alignItems="flex-start">
      <Text fontSize={16} fontWeight="600" color="$primary">
        -
      </Text>
      <YStack flex={1} gap="$1">
        <Text fontSize={16} fontWeight="600" color="$text">
          {title}
        </Text>
        <Text fontSize={14} color="$muted">
          {description}
        </Text>
      </YStack>
    </XStack>
  );
}
