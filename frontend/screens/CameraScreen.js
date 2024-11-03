import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');

      const locationPermission = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationPermission.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasLocationPermission === false) {
    return <Text>No access to location</Text>;
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        // Take picture and get image URI
        const photo = await cameraRef.takePictureAsync();
        setPhotoUri(photo.uri);

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        setLocationData({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: location.coords.city, // May require reverse geocoding
        });

        // Get current timestamp
        setTimestamp(new Date().toISOString());

        setIsPreview(true);
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    }
  };

  const retakePicture = () => {
    setPhotoUri(null);
    setIsPreview(false);
  };

  const submitPicture = () => {
    // Prepare data for API call
    const imageData = {
      photoUri,
      locationData,
      timestamp,
    };

    console.log('Submitting image data:', imageData);

    // Dummy API call
    setTimeout(() => {
      console.log('Dummy API call completed');
      // Reset state after submission
      setPhotoUri(null);
      setIsPreview(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isPreview && photoUri ? (
        <View style={styles.preview}>
          <Image source={{ uri: photoUri }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePicture}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={submitPicture}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera
          style={styles.camera}
          ref={(ref) => setCameraRef(ref)}
          type={Camera.Constants.Type.back}
        >
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
          </View>
        </Camera>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    marginBottom: 20,
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    alignSelf: 'center',
  },
  preview: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    width: 100,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
});
