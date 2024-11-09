import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { fetchSubjectSchedule } from '../../database/database';

export default function SubjectScheduleScreen() {
  const { groupId } = useLocalSearchParams();
  const [schedule, setSchedule] = useState<any[]>([]);

  // Fetch the subject schedule when the screen loads
  useEffect(() => {
    const loadSchedule = async () => {
      if (groupId) {
        const data = await fetchSubjectSchedule(Number(groupId));
        console.log('Fetched schedule:', data);
        setSchedule(data);
      }
    };
    loadSchedule();
  }, [groupId]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Group Schedule</ThemedText>
      <View style={styles.scheduleContainer}>
        {schedule.length > 0 ? (
          schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.subjectText}>
                {item.subject_name} - {item.day} at {item.hour}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No schedule available</Text>
        )}
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
  scheduleContainer: {
    width: '100%',
    padding: 16,
  },
  scheduleItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  subjectText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 18,
  },
});
