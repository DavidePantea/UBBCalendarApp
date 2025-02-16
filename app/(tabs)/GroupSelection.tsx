import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchGroups, updateUserYearAndGroup } from '../../database/database';

export default function GroupSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ HOOK CALLED AT TOP LEVEL - NO ERROR!
  const { yearId, userId, userRole } = params;
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      if (yearId) {
        const data = await fetchGroups(Number(yearId));
        console.log('Groups data:', data);
        setGroups(data);
      }
    };
    loadGroups();
  }, [yearId]);

  const handleGroupPress = async (groupId: number) => {
    if (!userId) {
      console.error('❌ ERROR: userId is missing when selecting a group!');
      return;
    }

    console.log(`✅ Selecting Group: ${groupId} for User: ${userId} and Year: ${yearId}`);

    try {
      await updateUserYearAndGroup(Number(userId), Number(yearId), groupId);
      router.push(`/SubjectsSelection?groupId=${groupId}&userId=${userId}`);
    } catch (error) {
      console.error('❌ Error updating user info:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Select a Group</ThemedText>
      <View style={styles.buttonContainer}>
        {groups.length > 0 ? (
          groups.map((group) => (
            <Pressable key={group.id} style={styles.button} onPress={() => handleGroupPress(group.id)}>
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