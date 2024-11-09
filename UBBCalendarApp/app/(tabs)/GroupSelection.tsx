import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams} from 'expo-router';
import { fetchGroups } from '../../database/database';

export default function GroupSelectionScreen() {
  const router = useRouter();
  const { yearId } = useLocalSearchParams(); // Get the yearId from the previous screen
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
    router.push(`/SubjectsSelection?groupId=${groupId}`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Select a Group</ThemedText>
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
  noDataText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 18,
  },
});
