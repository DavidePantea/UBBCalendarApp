import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSubjects } from '../../database/database';

export default function SubjectsSelection() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams(); // Get the groupId from the previous screen
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Fetch subjects when the screen loads
  useEffect(() => {
    const loadSubjects = async () => {
      if (groupId) {
        const data = await fetchSubjects(Number(groupId));
        console.log('Subjects data:', data); // Debug log
        setSubjects(data);
      }
    };
    loadSubjects();
  }, [groupId]);

  const handleSubjectPress = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      // Remove the subject if it's already selected
      setSelectedSubjects(selectedSubjects.filter((item) => item !== subjectName));
    } else {
      // Add the subject to the selected list
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleViewSchedule = () => {
    router.push(`/SubjectSchedule?groupId=${groupId}`);
  };

  const isSelected = (subjectName: string) => selectedSubjects.includes(subjectName);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select a Subject</ThemedText>
      <View style={styles.buttonContainer}>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Pressable
              key={subject.id}
              style={({ pressed }) => [
                styles.button,
                isSelected(subject.subject_name) && styles.buttonSelected,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleSubjectPress(subject.subject_name)}
            >
              <Text style={styles.buttonText}>{subject.subject_name}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noDataText}>No subjects available</Text>
        )}
      </View>

      {/* Conditionally render the "View Full Schedule" button */}
      {selectedSubjects.length > 0 && (
        <Pressable style={styles.scheduleButton} onPress={handleViewSchedule}>
          <Text style={styles.scheduleButtonText}>View Full Schedule</Text>
        </Pressable>
      )}
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
    backgroundColor: '#28a745',
  },
  buttonPressed: {
    backgroundColor: '#D0D0D0',
  },
  buttonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 18,
  },
});
