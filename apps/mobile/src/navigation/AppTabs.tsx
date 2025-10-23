/**
 * App Tabs Navigator
 *
 * Bottom tabs for main app navigation
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { AppTabParamList } from '../types/navigation'
import { Home, TrendingUp, FileText, User } from '@tamagui/lucide-icons'
import { tokens } from '@life/tokens'

// Stack Navigators
import { DashboardStack } from './DashboardStack'
import { MargemStack } from './MargemStack'
import { DocumentosStack } from './DocumentosStack'
import { PerfilStack } from './PerfilStack'

const Tab = createBottomTabNavigator<AppTabParamList>()

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.muted,
        tabBarStyle: {
          backgroundColor: tokens.colors.card,
          borderTopColor: tokens.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="MargemTab"
        component={MargemStack}
        options={{
          tabBarLabel: 'Margem',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="DocumentosTab"
        component={DocumentosStack}
        options={{
          tabBarLabel: 'Documentos',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilStack}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
