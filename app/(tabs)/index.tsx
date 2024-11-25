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
      {/* Title at the top */}
      <ThemedText type="title" style={styles.title}>
        Selectează anul:
      </ThemedText>
  
      {/* Year buttons in the middle */}
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
    justifyContent: 'space-between', // Space elements: title (top), buttons (middle)
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#06a77d',
  },
  title: {
    marginTop: 20, // Optional padding from the top
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e0e52', // Ensure readability
  },
  buttonContainer: {
    flex: 1, // Take up the middle space
    justifyContent: 'center', // Center buttons vertically
    alignItems: 'center', // Center buttons horizontally
    gap: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#005377',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    marginTop: 20,
    fontSize: 18,
  },
});
