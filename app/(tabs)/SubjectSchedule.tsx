import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSubjects } from '../../database/database';

export default function SubjectScheduleScreen() {
  const { groupId, selectedSubjects } = useLocalSearchParams();
  const [schedule, setSchedule] = useState<any[]>([]);
  const router = useRouter();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const loadSchedule = async () => {
    if (groupId) {
      const selected =
        typeof selectedSubjects === 'string'
          ? JSON.parse(selectedSubjects)
          : Array.isArray(selectedSubjects)
          ? selectedSubjects
          : [];

      const allSubjects = await fetchSubjects(Number(groupId));

      const filteredSchedule = allSubjects.filter(
        (subject) => selected.includes(subject.subject_name) || subject.type === 4
      );

      setSchedule(filteredSchedule);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [groupId, selectedSubjects]);

  const getSubjectsByDay = (day: string) => {
    return schedule.filter((subject) => subject.day === day);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Group Schedule
      </ThemedText>

      <View style={styles.scheduleContainer}>
        {daysOfWeek.map((day) => {
          const subjectsForDay = getSubjectsByDay(day);

          return (
            <View key={day} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{day}</Text>
              {subjectsForDay.length > 0 ? (
                subjectsForDay.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.scheduleItem}
                    onPress={() =>
                      router.push({
                        pathname: '/subject-details',
                        params: { 
                          subjectName: subject.subject_name,
                          day: subject.day,
                          hour: subject.hour,
                          type: subject.type,
                          place: subject.place,
                          professorId: subject.professor_id,
                          groupId: subject.group_id
                        },
                      })
                    }
                  >
                    <Text style={styles.subjectText}>
                      {subject.subject_name} - {subject.hour}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.scheduleItem}>
                  <Text style={styles.subjectText}>No courses</Text>
                </View>
              )}
            </View>
          );
        })}
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
  scheduleContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    justifyContent: 'flex-start',
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  scheduleItem: {
    backgroundColor: '#1A237E',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: '100%',
  },
  subjectText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
