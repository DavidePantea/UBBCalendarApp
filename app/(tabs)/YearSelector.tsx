import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchYears } from '../../database/database';

export default function TabOneScreen() {
  const router = useRouter();
  const { userRole } = useLocalSearchParams(); // Get the user role from query parameters
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    const loadYears = async () => {
      const data = await fetchYears();
      setYears(data);
    };
    loadYears();
  }, []);

  const handleYearPress = (yearId: number) => {
    // Pass the userRole to the next screen
    router.push(`/GroupSelection?yearId=${yearId}&userRole=${userRole}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Selectează anul:
      </ThemedText>
      <View style={styles.buttonContainer}>
        {years.length > 0 ? (
          years.map((year) => (
            <Pressable
              key={year.id}
              style={styles.button}
              onPress={() => handleYearPress(year.id)}
            >
              <Text style={styles.buttonText}>{year.year}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noDataText}>No years available</Text>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003BB5',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FEFFFE',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#1A237E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    marginTop: 20,
    fontSize: 18,
  },
});
