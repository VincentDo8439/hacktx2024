import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const FullCard = ({ image, title, subtitle, facts, cityState, date }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.factsContainer}>
        {facts.map((fact, index) => (
          <Text key={index} style={styles.fact}>
            {fact}
          </Text>
        ))}
      </View>
      <View style={styles.line} />
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{cityState}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Read More Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontStyle: 'italic',
    color: 'gray',
    paddingLeft: 20,
    paddingBottom: 4,
  },
factsContainer: {
    marginTop: 10,
  },
  fact: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 6,
    fontSize: 14,
    marginVertical: 2,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  tagText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FullCard;
