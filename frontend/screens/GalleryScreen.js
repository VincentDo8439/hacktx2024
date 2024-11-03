import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import CompactCard from "./GalleryComponents/CompactCard";
import FullCard from "./GalleryComponents/FullCard";

const DATA = [
  {
    id: "1",
    rarity: "1",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T22%3A57%3A13.807171.jpg?alt=media&token=88d31e21-00a0-48d2-bdd6-8b56e9c5a26e",
    title: "Racoon",
    subtitle: "Northern Racoon",
    facts: [
      "Raccoons have incredibly nimble front paws, allowing them to manipulate objects, open containers, and even turn doorknobs!",
      'Their distinctive black "mask" markings around their eyes help reduce glare and enhance their night vision, making them excellent nocturnal foragers.',
    ],
    cityState: "Austin, TX",
    date: "3:50 CT, 11/02/2024",
  },
  {
    id: "2",
    rarity: "2",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T22%3A54%3A29.545547.jpg?alt=media&token=5a78b8b9-069d-40d1-acda-437368bfa89d",
    title: "Item 2",
    subtitle: "Subtitle 2",
    facts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio quis leo ultrices vulputate vel at ligula.",
      "Phasellus feugiat ut quam non molestie. Fusce tellus est, finibus at interdum eget, vehicula non lorem.",
    ],
    cityState: "City, State",
    date: "X:XX CT, MM/DD/YYYY",
  },
  {
    id: "3",
    rarity: "3",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T23%3A43%3A40.579785.jpg?alt=media&token=f0c4a704-6611-41d3-9954-a3f8e80289d8",
    title: "Item 3",
    subtitle: "Subtitle 3",
    facts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio quis leo ultrices vulputate vel at ligula.",
      "Phasellus feugiat ut quam non molestie. Fusce tellus est, finibus at interdum eget, vehicula non lorem.",
    ],
    cityState: "City, State",
    date: "X:XX CT, MM/DD/YYYY",
  },
  {
    id: "4",
    rarity: "4",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-02T23%3A57%3A44.804083.jpg?alt=media&token=0a1154dd-668d-4e10-8c71-e9ef14913f8e",
    title: "Item 4",
    subtitle: "Subtitle 4",
    facts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio quis leo ultrices vulputate vel at ligula.",
      "Phasellus feugiat ut quam non molestie. Fusce tellus est, finibus at interdum eget, vehicula non lorem.",
    ],
    cityState: "City, State",
    date: "X:XX CT, MM/DD/YYYY",
  },
  {
    id: "5",
    rarity: "1",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-03T00%3A02%3A46.009874.jpg?alt=media&token=ccaaa443-7a96-4e61-b44a-e8690f39a299",
    title: "Item 5",
    subtitle: "Subtitle 5",
    facts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio quis leo ultrices vulputate vel at ligula.",
      "Phasellus feugiat ut quam non molestie. Fusce tellus est, finibus at interdum eget, vehicula non lorem.",
    ],
    cityState: "City, State",
    date: "X:XX CT, MM/DD/YYYY",
  },
  {
    id: "6",
    rarity: "2",
    image:
      "https://firebasestorage.googleapis.com/v0/b/hacktx-9757b.firebasestorage.app/o/card_images%2F2024-11-03T01%3A45%3A27.285641.jpg?alt=media&token=b2118018-aeb0-4131-8984-84091de3d3f4",
    title: "Item 6",
    subtitle: "Subtitle 6",
    facts: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec odio quis leo ultrices vulputate vel at ligula.",
      "Phasellus feugiat ut quam non molestie. Fusce tellus est, finibus at interdum eget, vehicula non lorem.",
    ],
    cityState: "City, State",
    date: "X:XX CT, MM/DD/YYYY",
  },
];

export default function GalleryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadResources = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      SplashScreen.hideAsync();
    };

    loadResources();
  }, []);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handleCardPress(item)}
      style={styles.cardContainer}
    >
      <CompactCard
        image={item.image}
        rarity={item.rarity}
        title={item.title}
        subtitle={item.subtitle}
      />
    </Pressable>
  );

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.modalOverlay}
          >
            <Pressable style={styles.modalContent}>
              {selectedItem && (
                <FullCard
                  image={selectedItem.image}
                  rarity={selectedItem.rarity}
                  title={selectedItem.title}
                  subtitle={selectedItem.subtitle}
                  facts={selectedItem.facts}
                  cityState={selectedItem.cityState}
                  date={selectedItem.date}
                />
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
    marginTop: '-10%'
  },
  container: {
    flex: 1,
    padding: 5,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 8,
  },
});
