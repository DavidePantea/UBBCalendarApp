import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { fetchYears } from '../../database/database';

export default function TabOneScreen() {
  const router = useRouter();
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    const loadYears = async () => {
      const data = await fetchYears();
      setYears(data);
    };
    loadYears();
  }, []);

  const handleYearPress = (yearId: number) => {
    router.push(`/GroupSelection?yearId=${yearId}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Selectează anul:</ThemedText>
      <View style={styles.buttonContainer}>
        {years.map((year) => (
          <Pressable
            key={year.id}
            style={styles.button}
            onPress={() => handleYearPress(year.id)}
          >
            <Text style={styles.buttonText}>{year.year}</Text>
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#011f4b',
  },
  buttonContainer: {
    width: '80%',
    gap: 10,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
