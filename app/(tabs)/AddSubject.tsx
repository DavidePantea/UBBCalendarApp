import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { 
  addSubject, fetchAllGroups, fetchAllProfessors, fetchAllPlaces 
} from '../../database/database';

export default function AddSubject() {
  const router = useRouter();

  const [subjectName, setSubjectName] = useState('');
  const [hour, setHour] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedType, setSelectedType] = useState<number>(1);
  const [groups, setGroups] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const groupsData = await fetchAllGroups();
      const professorsData = await fetchAllProfessors();
      const placesData = await fetchAllPlaces();
      setGroups(groupsData);
      setProfessors(professorsData);
      setPlaces(placesData);
    };

    loadData();
  }, []);

  const handleAddSubject = async () => {
    if (!subjectName || !hour || !selectedGroup || !selectedProfessor || !selectedPlace) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      await addSubject(selectedGroup, subjectName, selectedDay, hour, selectedType, selectedPlace, selectedProfessor);
      Alert.alert("Success", "Subject added successfully!");
      router.back(); // Go back to the previous screen
    } catch (error) {
      console.error("❌ Error adding subject:", error);
      Alert.alert("Error", "Failed to add subject.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>Add New Subject</ThemedText>

        <TextInput 
          style={styles.input} 
          placeholder="Subject Name" 
          placeholderTextColor="#ccc" 
          value={subjectName} 
          onChangeText={setSubjectName} 
        />

        <TextInput 
          style={styles.input} 
          placeholder="Hour (e.g., 09:00 AM)" 
          placeholderTextColor="#ccc" 
          value={hour} 
          onChangeText={setHour} 
        />

        <Text style={styles.label}>Select Group:</Text>
        {groups.map(group => (
          <TouchableOpacity 
            key={group.id} 
            style={[styles.button, selectedGroup === group.id && styles.selectedButton]} 
            onPress={() => setSelectedGroup(group.id)}
          >
            <Text style={styles.buttonText}>{group.group_name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Select Professor:</Text>
        {professors.map(professor => (
          <TouchableOpacity 
            key={professor.id} 
            style={[styles.button, selectedProfessor === professor.id && styles.selectedButton]} 
            onPress={() => setSelectedProfessor(professor.id)}
          >
            <Text style={styles.buttonText}>{professor.name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Select Place:</Text>
        {places.map(place => (
          <TouchableOpacity 
            key={place.id} 
            style={[styles.button, selectedPlace === place.id && styles.selectedButton]} 
            onPress={() => setSelectedPlace(place.id)}
          >
            <Text style={styles.buttonText}>{place.room_name} - {place.place_name}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Select Day:</Text>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
          <TouchableOpacity 
            key={day} 
            style={[styles.button, selectedDay === day && styles.selectedButton]} 
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.buttonText}>{day}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Select Type:</Text>
        {[1, 2, 3, 4].map(type => (
          <TouchableOpacity 
            key={type} 
            style={[styles.button, selectedType === type && styles.selectedButton]} 
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.buttonText}>Type {type}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddSubject}>
          <Text style={styles.addButtonText}>Add Subject</Text>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003BB5',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1, // ✅ Ensures scrolling content expands properly
    justifyContent: 'center', // ✅ Centers content properly
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFFFE',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 10,
  },
  input: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#1A237E',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#1A237E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginVertical: 5,
  },
  selectedButton: {
    backgroundColor: '#7B1FA2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});