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
      {/* Title at the top */}
      <ThemedText type="title" style={styles.title}>
        Select a Subject
      </ThemedText>
  
      {/* Subject buttons in the middle */}
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
  
      {/* "View Full Schedule" button at the bottom */}
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
    justifyContent: 'space-between', // Space elements evenly (top, middle, bottom)
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#06a77d',
  },
  title: {
    marginTop: 15, // Optional padding from the top
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e0e52', // Ensure it's readable
  },
  buttonContainer: {
    flex: 1, // Allow this section to take up the middle space
    justifyContent: 'center', // Align buttons in the center
    alignItems: 'center',
    gap: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#005377',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#0d21a1',
  },
  buttonPressed: {
    backgroundColor: '#588157',
  },
  buttonText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#005377',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15, // Space from the bottom
  },
  scheduleButtonText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    marginTop: 20,
    fontSize: 18,
  },
});

