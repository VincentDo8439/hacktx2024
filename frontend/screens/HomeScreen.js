import { React, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require("../assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require("../assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Light": require("../assets/fonts/SourceCodePro-Light.ttf"),
  });
};

export default function HomeScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding
        await fetchFonts(); // Load fonts
        setFontLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        await SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
      }
    };

    loadResources();
  }, []);

  if (!fontLoaded) {
    return null; // Render nothing while fonts are loading
  }

  return (
    <LinearGradient
      colors={["ffffff", "#ff9a9e", "#68b2e3", "ffffff"]} // Set your gradient colors here
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.background}
    >
      <Text style={styles.title}>Biodex</Text>
      <TouchableOpacity onPress={() => navigation.navigate('BottomTab')}>
        <Text style={styles.subtitle}>unlock biodiversity</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  title: {
    fontFamily: "SourceCodePro-Medium",
    fontSize: 50,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "SourceCodePro-Light",
    color: "#020202",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 4,
  },
});
