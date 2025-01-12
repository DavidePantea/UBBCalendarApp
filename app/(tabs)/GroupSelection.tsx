import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchGroups } from '../../database/database';

export default function GroupSelectionScreen() {
  const router = useRouter();
  const { yearId, userRole } = useLocalSearchParams(); // Get yearId and userRole from the previous screen
  const [groups, setGroups] = useState<any[]>([]);

  // Fetch groups when the screen loads
  useEffect(() => {
    const loadGroups = async () => {
      if (yearId) {
        const data = await fetchGroups(Number(yearId));
        console.log('Groups data:', data); // Debug log
        setGroups(data);
      }
    };
    loadGroups();
  }, [yearId]);

  const handleGroupPress = (groupId: number) => {
    // Pass userRole along with groupId to the next screen
    router.push(`/SubjectsSelection?groupId=${groupId}&userRole=${userRole}`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Title at the top */}
      <ThemedText type="title" style={styles.title}>
        Select a Group
      </ThemedText>
  
      {/* Group buttons in the middle */}
      <View style={styles.buttonContainer}>
        {groups.length > 0 ? (
          groups.map((group) => (
            <Pressable
              key={group.id}
              style={styles.button}
              onPress={() => handleGroupPress(group.id)}
            >
              <Text style={styles.buttonText}>{group.group_name}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.noDataText}>No groups available</Text>
        )}
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
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#80DEEA',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
