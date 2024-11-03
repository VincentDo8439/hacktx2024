import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // Use this to show a loading screen

const fetchFonts = () => {
  return Font.loadAsync({
    'SourceCodePro-Regular': require('./assets/fonts/SourceCodePro-Regular.ttf'),
    'SourceCodePro-Bold': require('./assets/fonts/SourceCodePro-Bold.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fetchFonts()
      .then(() => {
        setFontLoaded(true);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!fontLoaded) {
    return <AppLoading />; // Show loading screen until fonts are loaded
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Source Code Pro!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'SourceCodePro-Regular', // Use the loaded font
    fontSize: 20,
  },
});
