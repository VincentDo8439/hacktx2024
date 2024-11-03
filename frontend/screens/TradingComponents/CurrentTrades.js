import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CurrentTrades() {
  const [trades, setTrades] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTrades = async () => {
      try {
        
        const response = await fetch(
          `http://172.20.10.9:8000/trade/get_user_trades?id=CiC5IAVavu9mYE0CqhCg`
        );

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.trades);
        setTrades(data.trades); // Set the fetched trades to state
      } catch (err) {
        setError(err.message); // Set error message to state if fetch fails
      }
    };

    fetchUserTrades();
  }, []);

  if (!trades && !error) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6e7873" />
        <Text>Loading trades...</Text>
      </View>
    );
  }

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
