import '@/global.css';

import { DarkTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AppThemeProvider } from '@/components';
import { colors } from '@/theme';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.canvas,
    border: colors.border,
    card: colors.canvas,
    notification: colors.lime,
    primary: colors.lime,
    text: colors.textPrimary,
  },
};

export default function RootLayout() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.canvas);
  }, []);

  return (
    <AppThemeProvider fallback={<View style={{ flex: 1, backgroundColor: colors.canvas }} />}>
      <ThemeProvider value={navigationTheme}>
        <View style={{ flex: 1, backgroundColor: colors.canvas }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              animation: 'none',
              contentStyle: { backgroundColor: colors.canvas },
              headerBackButtonDisplayMode: 'minimal',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.canvas },
              headerTintColor: colors.textPrimary,
              headerTitleStyle: { fontFamily: 'OpenSans-Bold' },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="saved" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="malls/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="stores/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="deals/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="book/[serviceId]" options={{ headerShown: false }} />
            <Stack.Screen name="bookings/index" options={{ headerShown: false }} />
            <Stack.Screen name="bookings/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="business" options={{ headerShown: false }} />
            <Stack.Screen name="mall-dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="preview" options={{ title: 'Detail' }} />
          </Stack>
        </View>
      </ThemeProvider>
    </AppThemeProvider>
  );
}
