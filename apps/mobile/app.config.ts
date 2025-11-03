import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "LifeDigital",
  slug: "life-digital",
  scheme: "lifedigital",
  version: "0.1.0",
  orientation: "portrait",
  main: "index.js",
  newArchEnabled: true,
  icon: "./assets/icon.svg",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.svg",
    resizeMode: "contain",
    backgroundColor: "#0B0F1A",
  },
  ios: {
    bundleIdentifier: "com.lifedigital.app",
    supportsTablet: true,
    buildNumber: "1",
  },
  android: {
    package: "com.lifedigital.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.svg",
      backgroundColor: "#0B0F1A",
    },
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "USE_BIOMETRIC",
      "USE_FINGERPRINT",
      "NOTIFICATIONS",
    ],
  },
  web: {
    bundler: "metro",
  },
  plugins: ["expo-secure-store"],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8180",
    mmkvEncryptionKey:
      process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY ?? "development-only-key",
  },
});
