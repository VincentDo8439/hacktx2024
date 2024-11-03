import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Gem1 from './gem1.png';
import Gem2 from './gem2.png';
import Gem3 from './gem3.png';
import Gem4 from './gem4.png';

const fetchFonts = () => {
    return Font.loadAsync({
      'SourceCodePro-Regular': require('../.././assets/fonts/SourceCodePro-Regular.ttf'),
      'SourceCodePro-Medium': require('../.././assets/fonts/SourceCodePro-Medium.ttf'),
      'SourceCodePro-Italic': require('../.././assets/fonts/SourceCodePro-Italic.ttf'),
    });
  };

const FullCard = ({ image, rarity, title, subtitle, facts, cityState, date }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
      fetchFonts()
        .then(() => {
          setFontLoaded(true);
        })
        .catch((error) => console.error(error));
    }, []);
  
    if (!fontLoaded) {
      return <AppLoading />;
    }

    const renderGem = (rarity) => {
        const rarityStr = String(rarity);

        switch (rarityStr) {
            case "1":
              gemSource = Gem1;
              break;
            case "2":
              gemSource = Gem2;
              break;
            case "3":
              gemSource = Gem3;
              break;
            case "4":
              gemSource = Gem4;
              break;
            default:
              return null;
        }
  
          return <Image source={gemSource} style={styles.gem} />;
    };    


  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover"/>
      </View>
      <View>
        {renderGem(rarity)}
      </View>
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 270,
  },
  image: {
    width: '100%',
    height: 270,
  },
  title: {
    fontFamily: 'SourceCodePro-Medium',
    fontSize: 22,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontFamily: 'SourceCodePro-Italic',
    color: '#020202',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 4,
  },
  factsContainer: {
    marginTop: 10,
    marginBottom: -20,
  },
  fact: {
    fontFamily: 'SourceCodePro-Regular',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 6,
    fontSize: 14,
    marginVertical: 2,
    color: '#666666',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    marginVertical: 30,
    marginHorizontal: 30,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: -10,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    marginHorizontal: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#3C3C3C',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    marginRight: 8,
  },
  tagText: {
    fontFamily: 'SourceCodePro-Regular',
    fontSize: 12,
    color: '3C3C3C',
  },
  button: {
    backgroundColor: '#3C3C4C',
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 5,
    margin: 26,
    paddingVertical: 7,
    paddingHorizontal: 10,
    paddingLeft: 14,
    paddingRight: 14,
  },
  buttonText: {
    fontFamily: 'SourceCodePro-Regular',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  gem: {
    position: 'absolute',
    right: 30,
    top: -30, 
    width: 70, 
    height: 70,
    zIndex: 1,
  },
});

export default FullCard;