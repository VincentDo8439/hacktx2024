import { React, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require("../assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require("../assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Light": require("../assets/fonts/SourceCodePro-Light.ttf"),
  });
};

export default function ProfileScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fetchFonts()
      .then(() => {
        setFontLoaded(true);
      })
      .catch((error) => console.error(error));
  }, []);

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>dapig</Text>
        <Text style={styles.subtitle}>dapigontop@gmail.com</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: '50%'
  },
  title: {
    fontFamily: "SourceCodePro-Medium",
    fontSize: 50,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontFamily: "SourceCodePro-Light",
    color: "#020202",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 4,
  },
});
