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
    justifyContent: 'space-between', // Space out the title, buttons, and other elements
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#06a77d',
  },
  title: {
    marginTop: 20, // Add space from the top
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0e0e52', // Ensure text is visible
  },
  buttonContainer: {
    flex: 1, // Take up the middle space
    justifyContent: 'center', // Center buttons vertically
    alignItems: 'center', // Center buttons horizontally
    gap: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#005377',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', // Make the buttons stretch to fit the container width
  },
  buttonText: {
    color: '#cfdee7',
    fontWeight: 'bold',
  },
  noDataText: {
    color: '#800016',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20, // Add space below the title
  },
});

