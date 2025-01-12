import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initializeDatabase, insertSampleData } from '../database/database';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isDbReady, setDbReady] = useState(false);

  // Initialize the database
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully');
        await insertSampleData();
        setDbReady(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        setDbReady(true); // Proceed even if there’s an error
      }
    };

    setupDatabase();
  }, []);

  // Hide splash screen when assets and database are ready
  useEffect(() => {
    if (loaded && isDbReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isDbReady]);

  // Show a blank screen while loading assets or initializing the database
  if (!loaded || !isDbReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Tabs Layout */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Additional Screens */}
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="LogIn" />
        <Stack.Screen name="GroupSelection" />
        <Stack.Screen name="SubjectSchedule" />
        <Stack.Screen name="SubjectSelection" />
      </Stack>
    </ThemeProvider>
  );
}

