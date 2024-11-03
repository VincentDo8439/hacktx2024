import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MapsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Map is not available on the web.</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/300x200.png?text=Map+Unavailable' }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 200,
  },
});

export default MapsScreen;
