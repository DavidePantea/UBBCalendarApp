import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSubjects, addUserSubject, removeUserSubject, fetchUserSubjects } from '../../database/database';

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
  const params = useLocalSearchParams(); // ✅ Get all parameters
  const { groupId, userRole, userId } = params; // Extract userId from navigation params

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]); // Store subject IDs

  console.log('groupId:', groupId, 'userRole:', userRole, 'userId:', userId);

  useEffect(() => {
    const loadSubjects = async () => {
      if (groupId) {
        const allSubjects = await fetchSubjects(Number(groupId));
        const filteredSubjects = userRole === 'admin' 
          ? allSubjects 
          : allSubjects.filter((subject) => subject.type === 1 || subject.type === 2);
          
        setSubjects(filteredSubjects);
  
        console.log('📌 Loaded Subjects:', filteredSubjects); // ✅ Logs the subjects list
      }
    };
  
    const loadUserSubjects = async () => {
      if (userId) {
        const userSubjects = await fetchUserSubjects(Number(userId));
        setSelectedSubjects(userSubjects.map((subject: any) => subject.subject_id));
  
        console.log('📌 User Selected Subjects:', userSubjects); // ✅ Logs the user's selected subjects
      }
    };
  
    loadSubjects();
    loadUserSubjects();
  }, [groupId, userRole, userId]);

  const handleSubjectPress = async (subjectId: number) => {
    if (!userId) {
      Alert.alert('❌ Error', 'User ID is missing');
      return;
    }

    const normalizedUserId = Number(userId);

    if (selectedSubjects.includes(subjectId)) {
      await removeUserSubject(normalizedUserId, subjectId);
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
      console.log(`❌ Removed subject ${subjectId} for user ${normalizedUserId}`);
    } else {
      await addUserSubject(normalizedUserId, subjectId);
      setSelectedSubjects([...selectedSubjects, subjectId]);
      console.log(`✅ Added subject ${subjectId} for user ${normalizedUserId}`);
    }
  };

  const handleViewSchedule = () => {
    router.push({
      pathname: '/SubjectSchedule',
      params: {
        groupId,
        selectedSubjects: JSON.stringify(selectedSubjects), // ✅ Correctly passing IDs
        userRole, 
      },
    });
  };



  const isSelected = (subjectId: number) => selectedSubjects.includes(subjectId);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Select a Subject</ThemedText>

      <View style={styles.buttonContainer}>
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Pressable
              key={subject.id}
              style={[
                styles.button,
                isSelected(subject.id) && styles.buttonSelected,
              ]}
              onPress={() => handleSubjectPress(subject.id)}
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
    marginTop: 15,
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
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#7B1FA2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#1A237E',
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
    backgroundColor: '#1A237E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  modifyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#80DEEA',
    marginTop: 20,
    fontSize: 18,
  },
});