import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* This makes TabLayout the root tab screen */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 

        {/* Other screens are added as stack screens */}
        <Stack.Screen name="GroupSelection" options={{ headerShown: false }} />
        <Stack.Screen name="SubjectSchedule" options={{ headerShown: false }} />
        <Stack.Screen name="SubjectSelection" options={{ headerShown: false }} />
        
        {/* Handle not found routes */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
