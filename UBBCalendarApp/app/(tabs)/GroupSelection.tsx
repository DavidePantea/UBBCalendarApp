// app/(tabs)/GroupSelection.tsx
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function GroupSelectionScreen() {
  const router = useRouter();

  const handleGroupPress = (year: string) => {
    router.push('/SubjectsSelection');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select a Group</ThemedText>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => handleGroupPress('1')}>
          <Text style={styles.buttonText}>Group 1</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleGroupPress('2')}>
          <Text style={styles.buttonText}>Group 2</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleGroupPress('3')}>
          <Text style={styles.buttonText}>Group 3</Text>
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
