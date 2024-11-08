import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Modal, Portal, Button, Provider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import * as LocationGeocoding from 'expo-location';

const MapsScreen = () => {
  // State variables
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  // Fetch user location and card data
  useEffect(() => {
    (async () => {
      try {
        // Request permission for location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        // Fetch card data from backend API
        const response = await axios.get('http://192.168.96.239:8000/card/view_all_cards');
        const cardsData = response.data;

        // Process each card to include the city name using reverse geocoding
        const processedCards = await Promise.all(
          cardsData.cards.map(async (card) => {
            const { latitude, longitude } = card;

            // Reverse geocoding to get city name
            let geocode = await LocationGeocoding.reverseGeocodeAsync({ latitude, longitude });
            let city = geocode[0]?.city || geocode[0]?.name || 'Unknown Location';

            return {
              ...card,
              city,
            };
          })
        );

        setMarkers(processedCards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMsg('Failed to fetch data.');
        setLoading(false);
      }
    })();
  }, []);

  // Functions to handle modal visibility
  const showModal = (animal) => {
    setSelectedAnimal(animal);
    setVisible(true);
  };

  const hideModal = () => {
    if (modalRef.current) {
      modalRef.current.bounceOut(600).then(() => {
        setVisible(false);
        setSelectedAnimal(null);
      });
    } else {
      setVisible(false);
      setSelectedAnimal(null);
    }
  };

  // Display an error message if location isn't available
  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Display a loading indicator while fetching location and data
  if (loading || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
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
              {markers.map((marker, index) => (
                <Marker
                  key={index}
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
              contentContainerStyle={[
                styles.modal,
                { backgroundColor: selectedAnimal?.hex_code || 'white' },
              ]}
            >
              {selectedAnimal && (
                <Animatable.View
                  ref={modalRef}
                  animation="bounceIn"
                  duration={600}
                >
                  <Text style={styles.animalName}>
                    {selectedAnimal.species_name} ({selectedAnimal.scientific_name})
                  </Text>
                  <Image
                    source={{ uri: selectedAnimal.card_image_url }}
                    style={styles.animalImage}
                  />
                  <Text style={styles.animalLocation}>{selectedAnimal.city}</Text>
                  <Text style={styles.animalTime}>
                    {new Date(selectedAnimal.timestamp).toLocaleString()}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={hideModal}
                    style={styles.closeButton}
                  >
                    Close
                  </Button>
                </Animatable.View>
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
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  animalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
  animalLocation: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
    color: '#fff',
  },
  animalTime: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  animalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapsScreen;