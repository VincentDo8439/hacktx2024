import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";
import FullCard from "./GalleryComponents/FullCard"; // Import FullCard component
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require(".././assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require(".././assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Italic": require(".././assets/fonts/SourceCodePro-Italic.ttf"),
  });
};

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState(null); // New state variable for card data
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fetchFonts();
        setFontLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === "granted");
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
      console.log(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=35dd821656764679a35245b5fabfa493`
      );

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=35dd821656764679a35245b5fabfa493`
      );
      const data = await response.json();
      console.log(data);
      if (data && data.results && data.results.length > 0) {
        const components = data.results[0].components;
        return (
          components.city || components.town || components.village || "Unknown"
        );
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
      return "Unknown";
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
      const cityName = await getCityName(
        locationData.latitude,
        locationData.longitude
      );

      // Prepare data for API call
      const card_data = {
        image_url: downloadURL,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: cityName, // Include city name
        timestamp: timestamp, // Include timestamp
      };

      const user_data = "CiC5IAVavu9mYE0CqhCg"; // Replace with actual user ID

      const data = {
        card_data,
        user_data,
      };

      console.log("Submitting data to backend:", data);

      // Call the backend API
      const response2 = await fetch(
        `http://192.168.96.239:8000/card/create_card`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response2.json();

      console.log("Backend response:", result);

      // Handle successful submission
      setCardData(result.card_data);

      // Reset preview and photoUri
      setIsPreview(false);
      setPhotoUri(null);
    } catch (error) {
      console.error("Error submitting picture:", error);
      // Optionally inform the user of the error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e90ff" />
          <Text style={styles.text}>Processing your request...</Text>
        </View>
      ) : cardData ? (
        // Display FullCard component
        <View style={styles.cardContainer}>
          <FullCard
            image={cardData.card_image_url}
            rarity={cardData.rarity}
            title={cardData.species_name}
            subtitle={cardData.scientific_name}
            facts={cardData.facts}
            cityState={cardData.city}
            date={new Date(cardData.timestamp).toLocaleString()}
          />
        </View>
      ) : isPreview && photoUri ? (
        // Existing preview and submit logic
        <View style={styles.preview}>
          <Text style={styles.subtitle}>Do you like this image?</Text>
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
        // Initial state with "Take Picture" button
        <View style={styles.cameraContainer}>
          <Text style={styles.subtitle}>Begin your collection!</Text>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 150,
    padding: 15,
    backgroundColor: "#B7CCB9",
    borderRadius: 5,
    alignItems: "center",
  },
  preview: {
    flex: 1,
    marginBottom: "20%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "60%",
    resizeMode: "contain",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingBottom: 20,
  },
  button: {
    width: 150,
    padding: 15,
    backgroundColor: "#B7CCB9",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  subtitle: {
    color: "#000",
    fontWeight: "bold",
    fontFamily: "SourceCodePro-Regular",
    marginBottom: "5%",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "SourceCodePro-Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: "15%"
  },
});
