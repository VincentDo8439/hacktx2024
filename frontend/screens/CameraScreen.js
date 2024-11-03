import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import uuid from 'react-native-uuid';
import Svg, { Circle, Path } from 'react-native-svg';
import bg from "./cameraBG.png";

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');
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
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const uri = result.uri || result.assets[0].uri;
      setPhotoUri(uri);

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Get current timestamp
      setTimestamp(new Date().toISOString());
      setIsPreview(true);
    }
  };

  const retakePicture = () => {
    setPhotoUri(null);
    setIsPreview(false);
  };

  const getCityName = async (latitude, longitude) => {
    try {
      console.log(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=35dd821656764679a35245b5fabfa493`)

      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=35dd821656764679a35245b5fabfa493`);
      const data = await response.json();
      console.log(data)
      if (data && data.results && data.results.length > 0) {
        const components = data.results[0].components;
        return components.city || components.town || components.village || 'Unknown';
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error fetching city name:', error);
      return 'Unknown';
    }
  };
  

  const submitPicture = async () => {
    setIsLoading(true); // Start loading indicator
  
    try {
      // Generate a unique file name
      const imageId = uuid.v4();
      const response = await fetch(photoUri);
      const blob = await response.blob();
  
      // Create a reference to the storage bucket location
      const storageRef = ref(storage, `original_images/${imageId}.jpg`);
  
      // Upload the image
      await uploadBytes(storageRef, blob);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
  
      // Reverse geocode to get city name
      const cityName = await getCityName(locationData.latitude, locationData.longitude);
  
      // Prepare data for API call
      const card_data = {
        image_url: downloadURL,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: cityName, // Include city name
        timestamp: timestamp, // Include timestamp
      };

      const user_data = 'CiC5IAVavu9mYE0CqhCg'; // Replace with actual user ID or keep as hardcoded

      const data = {
        card_data,
        user_data,
      };
  
      console.log('Submitting data to backend:', data);
  
      // Call the backend API
      // CALL WHEN THE BACKEND IS HOSTED
      const response2 = await fetch(`http://172.20.10.9:8000/card/create_card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await response2.json();
  
      console.log('Backend response:', result);
  
      // Handle successful submission
      // Reset state after submission
      setPhotoUri(null);
      setIsPreview(false);
    } catch (error) {
      console.error('Error submitting picture:', error);
      // Optionally inform the user of the error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={bg} style={styles.background}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e90ff" />
            <Text style={styles.text}>Processing your request...</Text>
          </View>
        ) : isPreview && photoUri ? (
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
          <View style={styles.cameraContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureText}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 180,
    padding: 20,
    backgroundColor: '#ff6f61', // Vibrant color
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  captureText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    width: 100,
    padding: 15,
    backgroundColor: '#ff6f61',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});