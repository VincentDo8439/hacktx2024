// MapsScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Modal, Portal, Button, Provider } from 'react-native-paper';

const MapsScreen = () => {
  // State variables
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // Dummy data for markers
  const dummyData = [
    {
      id: 1,
      latitude: 37.78825,
      longitude: -122.4324,
      animal: 'Deer',
      picture: 'https://example.com/deer.jpg',
      time: '2023-10-10 10:00 AM',
    },
    {
      id: 2,
      latitude: 37.78925,
      longitude: -122.4354,
      animal: 'Fox',
      picture: 'https://example.com/fox.jpg',
      time: '2023-10-11 02:00 PM',
    },
    // Add more dummy markers as needed
  ];

  // Fetch user location
  useEffect(() => {
    (async () => {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setMarkers(dummyData); // Set dummy markers
    })();
  }, []);

  // Functions to handle modal visibility
  const showModal = (animal) => {
    setSelectedAnimal(animal);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  // Display an error message if location isn't available
  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Display a loading indicator while fetching location
  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Provider>
        <View style={styles.container}>
          {/* Map View */}
          {Platform.OS !== 'web' ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              showsUserLocation={true}
            >
              {/* Render Markers */}
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  onPress={() => showModal(marker)}
                />
              ))}
            </MapView>
          ) : (
            <View style={styles.centered}>
              <Text>Map is not available on web platform.</Text>
            </View>
          )}

          {/* Modal for Animal Details */}
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modal}
            >
              {selectedAnimal && (
                <>
                  <Text style={styles.animalName}>{selectedAnimal.animal}</Text>
                  <Image
                    source={{ uri: selectedAnimal.picture }}
                    style={styles.animalImage}
                  />
                  <Text style={styles.animalTime}>{selectedAnimal.time}</Text>
                  <Button mode="contained" onPress={hideModal}>
                    Close
                  </Button>
                </>
              )}
            </Modal>
          </Portal>
        </View>
      </Provider>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
  },
  animalName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  animalImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  animalTime: {
    fontSize: 16,
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapsScreen;
