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
      {/* Title at the top */}
      <ThemedText type="title" style={styles.title}>
        Group Schedule
      </ThemedText>
  
      {/* Schedule items in the middle */}
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
    justifyContent: 'space-between', // Space out elements (title, schedule, footer)
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#06a77d',
  },
  title: {
    marginTop: 20, // Space from the top
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e0e52',
  },
  scheduleContainer: {
    flex: 1, // Allow this section to take up the middle space
    width: '100%',
    padding: 16,
    justifyContent: 'center', // Center schedule items vertically
    alignItems: 'center', // Align items horizontally in the center
  },
  scheduleItem: {
    backgroundColor: '#005377',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: '90%', // Make the items slightly smaller than the container width
  },
  subjectText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20, // Add space between the message and other elements
  },
});

