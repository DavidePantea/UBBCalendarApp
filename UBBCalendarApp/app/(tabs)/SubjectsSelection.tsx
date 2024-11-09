import { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function SubjectsSelection() {
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSubjectPress = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      // Remove the subject if it's already selected
      setSelectedSubjects(selectedSubjects.filter((item) => item !== subject));
    } else {
      // Add the subject to the selected list
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const isSelected = (subject: string) => selectedSubjects.includes(subject);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select a Group</ThemedText>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            isSelected('AI') && styles.buttonSelected,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleSubjectPress('AI')}
        >
          <Text style={styles.buttonText}>AI</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            isSelected('Proiect Colectiv') && styles.buttonSelected,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleSubjectPress('Proiect Colectiv')}
        >
          <Text style={styles.buttonText}>Proiect Colectiv</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            isSelected('Limba Spaniola') && styles.buttonSelected,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => handleSubjectPress('Limba Spaniola')}
        >
          <Text style={styles.buttonText}>Limba Spaniola</Text>
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
  buttonSelected: {
    backgroundColor: '#28a745', // Green color when selected
  },
  buttonPressed: {
    backgroundColor: '#D0D0D0', // Gray color when pressed
  },
  buttonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
