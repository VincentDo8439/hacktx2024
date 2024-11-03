import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import CompactCard from './GalleryComponents/CompactCard';
import FullCard from './GalleryComponents/FullCard';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

SplashScreen.preventAutoHideAsync();

export default function GalleryScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAnimation, setModalAnimation] = useState('bounceIn');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          'http://192.168.96.239:8000/card/view_gallery',
          {
            params: { user_id: '0qiUVhOnSuSlD2HeRaec' }, // Replace with the actual user_id if needed
          }
        );

        // Assuming response.data.cards is the array of cards from the API response
        const fetchedCards = response.data.cards.map((card) => ({
          id: card.card_id,
          rarity: card.rarity, // Update this if your API has a different field for rarity
          image: card.card_image_url,
          title: card.species_name,
          subtitle: card.scientific_name,
          facts: card.facts,
          hexCode: card.hex_code,
          original_image_url: card.image_url,
          cityState: card.city || 'Unknown Location', // 'city' should come from reverse geocoding if necessary
          date: new Date(card.timestamp).toLocaleString(), // Format the date as desired
        }));
        setCardsData(fetchedCards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleCardPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalAnimation('bounceOut');
    setTimeout(() => {
      setModalVisible(false);
      setModalAnimation('bounceIn'); // Reset animation for next time
    }, 500); // Duration should match the animation duration
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handleCardPress(item)}
      style={styles.cardContainer}
    >
      <Animatable.View animation="zoomIn" duration={500}>
        <CompactCard
          image={item.image}
          rarity={item.rarity}
          title={item.title}
          subtitle={item.subtitle}
          hexCode={item.hexCode}
        />
      </Animatable.View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Animatable.View animation="bounceIn" iterationCount={1}>
          <ActivityIndicator size="large" color="#0000ff" />
        </Animatable.View>
      </View>
    );
  }

  return (
    <Animatable.View animation="fadeIn" duration={500} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={cardsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <Pressable onPress={handleCloseModal} style={styles.modalOverlay}>
            <Animatable.View
              animation={modalAnimation}
              iterationCount={1}
              duration={500}
              style={styles.modalContent}
            >
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
            </Animatable.View>
          </Pressable>
        </Modal>
        <View style={styles.block}></View>
      </SafeAreaView>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: '-10%',
  },
  block: {
    height: '8%',
  },
  container: {
    flex: 1,
    padding: 5,
    paddingBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
