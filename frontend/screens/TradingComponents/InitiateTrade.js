import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InitiateTrade() {
    return (
      <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <Text>Trading Screen Screen</Text>
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
    },
  });