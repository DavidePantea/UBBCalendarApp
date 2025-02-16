import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { fetchUsers, fetchUserDetails, fetchUserSubjects } from '../../database/database';

type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const users: User[] = await fetchUsers();
      const user = users.find((u: User) => u.username === username && u.password === password);

      if (!user) {
        Alert.alert('❌ Login Failed', 'Invalid username or password');
        return;
      }

      Alert.alert('✅ Login Successful', `Welcome, ${user.username}!`);
      console.log(`🔹 Checking saved selections for userId: ${user.id}`);

      // 🔥 Fetch user details (year, group)
      const userDetails = await fetchUserDetails(user.id);

      if (!userDetails || !userDetails.year_id || !userDetails.group_id) {
        console.log(`⚠️ No year/group assigned. Redirecting to YearSelector.`);
        router.push(`/YearSelector?userId=${user.id}&userRole=${user.role}`);
        return;
      }

      console.log(`📌 User Details:`, userDetails);

      // 🔥 Fetch user subjects
      const userSubjects = await fetchUserSubjects(user.id);
      console.log(`📌 User Subjects:`, userSubjects);

      if (userSubjects.length > 0) {
        console.log(`🔹 Redirecting to SubjectSchedule for userId: ${user.id}`);
        router.push(`/SubjectSchedule?userId=${user.id}&groupId=${userDetails.group_id}&selectedSubjects=${JSON.stringify(userSubjects.map(s => s.subject_id))}`);
      } else {
        console.log(`⚠️ No subjects selected. Redirecting to SubjectsSelection.`);
        router.push(`/SubjectsSelection?groupId=${userDetails.group_id}&userId=${user.id}`);
      }
    } catch (error) {
      console.error('❌ Error during login:', error);
      Alert.alert('❌ Error', 'Something went wrong during login.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003BB5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FEFFFE',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1A237E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});