import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopTabNavigator from "../navigation/TopTabNavigator";

export default function TradingScreen() {
  return <TopTabNavigator />;
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
  },
});
