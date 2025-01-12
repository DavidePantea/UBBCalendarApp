import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSubjects } from '../../database/database';

type Subject = {
  id: number;
  group_id: number;
  subject_name: string;
  day: string;
  hour: string;
  type: number;
};

export default function SubjectsSelection() {
  const router = useRouter();
  const { groupId, userRole } = useLocalSearchParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  console.log('groupId:', groupId, 'userRole:', userRole);

  const loadSubjects = async () => {
    if (groupId) {
      const allSubjects = await fetchSubjects(Number(groupId));

      // Filter subjects based on user role
      const filteredSubjects =
        userRole === 'admin'
          ? allSubjects // Admin sees all subjects
          : allSubjects.filter((subject) => subject.type === 1 || subject.type === 2);

      setSubjects(filteredSubjects);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [groupId, userRole]);

  const handleSubjectPress = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleViewSchedule = () => {
    router.push(
      `/SubjectSchedule?groupId=${groupId}&selectedSubjects=${JSON.stringify(selectedSubjects)}`
    );
  };

  const handleModifySchedule = () => {
    router.push(`/ModifySchedule?groupId=${groupId}`);
  };

  const isSelected = (subjectName: string) => selectedSubjects.includes(subjectName);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Select a Subject
      </ThemedText>

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

      {selectedSubjects.length > 0 && (
        <Pressable style={styles.scheduleButton} onPress={handleViewSchedule}>
          <Text style={styles.scheduleButtonText}>View Full Schedule</Text>
        </Pressable>
      )}

      {/* Add Modify Schedule Button for Admin */}
      {userRole === 'admin' && (
        <Pressable style={styles.modifyButton} onPress={handleModifySchedule}>
          <Text style={styles.modifyButtonText}>Modify Schedule</Text>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#06a77d',
  },
  title: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e0e52',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 15,
  },
  scheduleButtonText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  modifyButton: {
    backgroundColor: '#800016',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  modifyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    marginTop: 20,
    fontSize: 18,
  },
});
