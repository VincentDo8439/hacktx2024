import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CompactCard from "../GalleryComponents/CompactCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require("../.././assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require("../.././assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Italic": require("../.././assets/fonts/SourceCodePro-Italic.ttf"),
  });
};


export default function CurrentTrades() {
  const [trades, setTrades] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchUserTrades = async () => {
      try {
        const response = await fetch(
          `http://192.168.96.239:8000/trade/get_user_trades?id=CiC5IAVavu9mYE0CqhCg`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.trades[0]);
        setTrades(data.trades);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserTrades();
  }, []);

  const acceptTrade = async (tradeId) => {
    const url = "http://192.168.96.239:8000/trade/accept_trade";
    const data = {
      id: tradeId,
    };

    try {
      console.log(data)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json()
      console.log(result)
      if (!response.ok) {
        console.log("here")
        throw new Error(result.error || "Something went wrong");
      }

      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const declineTrade = async (tradeId) => {
    const url = "http://192.168.96.239:8000/trade/update_trade_status";
    const data = {
      id: tradeId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Something went wrong");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  if (!trades && !error) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6e7873" />
        <Text>Loading trades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={trades}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tradeContainer}>
              <View style={styles.cardContainer}>
                <View style={styles.cardWrapper}>
                  <CompactCard
                    image={item.card_data_one.card_image_url}
                    rarity={item.card_data_one.rarity}
                    title={item.card_data_one.species_name}
                    subtitle={item.card_data_one.scientific_name}
                  />
                </View>
                <MaterialCommunityIcons
                  name="swap-horizontal-bold"
                  size={40}
                  color="#dcbea7"
                  style={styles.swapIcon}
                />
                <View style={styles.cardWrapper}>
                  <CompactCard
                    image={item.card_data_two.card_image_url}
                    rarity={item.card_data_two.rarity}
                    title={item.card_data_two.species_name}
                    subtitle={item.card_data_two.scientific_name}
                  />
                </View>
              </View>
              {item.user_id_two === "CiC5IAVavu9mYE0CqhCg" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptTrade(item.id)}
                  >
                    <Text style={styles.buttonText}>Accept Trade</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => declineTrade(item.id)}
                  >
                    <Text style={styles.buttonText}>Decline Trade</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
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
    // Removed alignItems and justifyContent to allow content to align naturally
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tradeContainer: {
    marginVertical: 10,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderWidth: '1px solid',
    borderRadius: 10,
    
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  swapIcon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#F44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: 'SourceCodePro-Regular'
  },
  text: {
    fontFamily: 'SourceCodePro-Regular',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '10%'
  }
});
