// app/(tabs)/index.tsx (TabTwoScreen)
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const router = useRouter();

  const handleYearPress = (year: string) => {
    router.push('/GroupSelection');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select the Year</ThemedText>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => handleYearPress('2022')}>
          <Text style={styles.buttonText}>2022</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleYearPress('2023')}>
          <Text style={styles.buttonText}>2023</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleYearPress('2024')}>
          <Text style={styles.buttonText}>2024</Text>
        </Pressable>
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