import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { fetchSubjectById } from '../../database/database'; // Fetch function
import * as Location from 'expo-location';

export default function SubjectDetailsScreen() {
  const { subjectName, groupId } = useLocalSearchParams();

  // Ensure subjectName is always a string
  const subjectNameStr = Array.isArray(subjectName) ? subjectName[0] : subjectName;

  const [subjectDetails, setSubjectDetails] = useState<any>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const loadSubjectDetails = async () => {
      if (subjectName && groupId) {
        const subjectNameString = Array.isArray(subjectName) ? subjectName[0] : subjectName;
  
        const details = await fetchSubjectById(subjectNameString, Number(groupId));
        setSubjectDetails(details);
  
        if (details?.address) {
          await fetchCoordinates(details.address);
        }
      }
    };
    loadSubjectDetails();
  }, [subjectName, groupId]);

  // Fetch coordinates using Geolocation API
  const fetchCoordinates = async (address: string) => {
    try {
      let geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        setLocation({
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  if (!subjectDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading subject details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subjectDetails.subject_name}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📅 Day: {subjectDetails.day}</Text>
        <Text style={styles.infoText}>⏰ Time: {subjectDetails.hour}</Text>
        <Text style={styles.infoText}>📌 Type: {getTypeName(subjectDetails.type)}</Text>
      </View>

      <View style={styles.placeContainer}>
        <Text style={styles.placeTitle}>📍 Location</Text>
        <Text style={styles.placeText}>🏫 {subjectDetails.place_name}</Text>
        <Text style={styles.placeText}>🛋️ Room: {subjectDetails.room_name}</Text>
        <Text style={styles.placeText}>📍 Address: {subjectDetails.address}</Text>
      </View>

      {subjectDetails.professor_name && (
        <View style={styles.professorContainer}>
          <Text style={styles.professorTitle}>👨‍🏫 Professor</Text>
          <Text style={styles.professorText}>
            {subjectDetails.professor_name} ({subjectDetails.title})
          </Text>
          <Text style={styles.professorText}>{subjectDetails.department}</Text>
        </View>
      )}

      {/* Google Map Section */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={location}
            title={subjectDetails.place_name}
            description={subjectDetails.address}
          />
        </MapView>
      )}
    </View>
  );
}

const getTypeName = (type: number) => {
  switch (type) {
    case 1: return 'Lecture';
    case 2: return 'Seminar';
    case 3: return 'Lab';
    case 4: return 'Mandatory';
    default: return 'Unknown';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#003BB5',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FEFFFE',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#1A237E',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  placeContainer: {
    backgroundColor: '#0D47A1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  placeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEFFFE',
    marginBottom: 5,
  },
  placeText: {
    fontSize: 18,
    color: '#FEFFFE',
    marginBottom: 5,
  },
  professorContainer: {
    backgroundColor: '#0D47A1',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  professorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEFFFE',
    marginBottom: 5,
  },
  professorText: {
    fontSize: 18,
    color: '#FEFFFE',
  },
  loadingText: {
    fontSize: 20,
    color: '#FEFFFE',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});