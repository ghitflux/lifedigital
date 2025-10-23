import React from 'react'
import { StatusBar } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClientProvider } from '@tanstack/react-query'
import { tamaguiConfig } from '@life/tokens'
import { Toaster } from '@life/ui'
import { RootNavigator } from './src/navigation'
import { queryClient } from './src/lib/queryClient'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <RootNavigator />
            <Toaster />
          </SafeAreaProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
