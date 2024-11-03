import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CompactCard = ({ image, title, subtitle }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    padding: 5,
  },
  subtitle: {
    fontStyle: 'italic',
    color: 'gray',
    padding: 5,
  },
});

export default CompactCard;
