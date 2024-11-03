import { React, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CompactCard from "../GalleryComponents/CompactCard";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CurrentTrades() {
  const [trades, setTrades] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const fetchUserTrades = async () => {
    //   try {
    //     const response = await fetch(
    //       `http://172.20.10.9:8000/trade/get_user_trades?id=CiC5IAVavu9mYE0CqhCg`
    //     );

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     console.log(data.trades[0]);
    //     setTrades(data.trades); 
    //   } catch (err) {
    //     setError(err.message);
    //   }
    // };

    // Simulated dummy data for testing
    const dummyTrades = [
      {
        id: "1",
        card_data_one: {
          card_image_url: "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T22%3A57%3A13.807171.jpg?alt=media&token=88d31e21-00a0-48d2-bdd6-8b56e9c5a26e0",
          rarity: "Rare",
          species_name: "Species One",
          scientific_name: "Species One Scientific",
        },
        card_data_two: {
          card_image_url: "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T22%3A54%3A29.545547.jpg?alt=media&token=5a78b8b9-069d-40d1-acda-437368bfa89d",
          rarity: "Common",
          species_name: "Species Two",
          scientific_name: "Species Two Scientific",
        },
        user_id_one: "CiC5IAVavu9mYE0CqhCg",
      },
      {
        id: "2",
        card_data_one: {
          card_image_url: "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T23%3A43%3A40.579785.jpg?alt=media&token=f0c4a704-6611-41d3-9954-a3f8e80289d8",
          rarity: "Uncommon",
          species_name: "Species Three",
          scientific_name: "Species Three Scientific",
        },
        card_data_two: {
          card_image_url: "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T23%3A57%3A44.804083.jpg?alt=media&token=0a1154dd-668d-4e10-8c71-e9ef14913f8e",
          rarity: "Legendary",
          species_name: "Species Four",
          scientific_name: "Species Four Scientific",
        },
        user_id_one: "AnotherUserId",
      },
    ];

    setTrades(dummyTrades); // Set the dummy trades to state
  }, []);


  // const acceptTrade = async (tradeId) => {
  //   const url = 'http://172.20.10.9:8000/trade/accept_trade'; // Replace with your actual backend URL
  //   const data = {
  //     id: tradeId, // Include any other necessary data here
  //   };
  
  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       throw new Error(errorResponse.error || 'Something went wrong');
  //     }
  
  //     const result = await response.json(); // If the response is in JSON format
  //     return result; // Handle the success response as needed
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     // Handle the error appropriately, maybe set an error state
  //     return null; // or throw error to be handled by caller
  //   }
  // }

  // const declineTrade = async (tradeId) => {
  //   const url = 'http://172.20.10.9:8000/trade/update_trade_status'; // Replace with your actual backend URL
  //   const data = {
  //     id: tradeId, // Include any other necessary data here
  //   };
  
  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       throw new Error(errorResponse.error || 'Something went wrong');
  //     }
  
  //     const result = await response.json(); // If the response is in JSON format
  //     return result; // Handle the success response as needed
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     // Handle the error appropriately, maybe set an error state
  //     return null; // or throw error to be handled by caller
  //   }
  // }


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
        <FlatList
          data={trades}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tradeContainer}>
              <View style={styles.cardContainer}>
                <CompactCard
                  image={item.card_data_one.card_image_url}
                  rarity={item.card_data_one.rarity}
                  title={item.card_data_one.species_name}
                  subtitle={item.card_data_one.scientific_name}
                  style={styles.card}
                />
                <MaterialCommunityIcons
                  name="swap-horizontal-bold"
                  size={40}
                  color="#dcbea7"
                />
                <CompactCard
                  image={item.card_data_two.card_image_url}
                  rarity={item.card_data_two.rarity}
                  title={item.card_data_two.species_name}
                  subtitle={item.card_data_two.scientific_name}
                  style={styles.card}
                />
              </View>
              {item.user_id_two === "CiC5IAVavu9mYE0CqhCg" && (
                <TouchableOpacity onPress={() => acceptTrade(item.id)}>
                  <Text>Accept trade</Text>
                </TouchableOpacity>
              )}
              {item.user_id_two === "CiC5IAVavu9mYE0CqhCg" && (
                <TouchableOpacity onPress={() => declineTrade(item.id)}>
                  <Text>Decline trade</Text>
                </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
  },
  tradeContainer: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
