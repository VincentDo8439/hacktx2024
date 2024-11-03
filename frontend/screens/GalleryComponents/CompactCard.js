import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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

const CompactCard = ({ image, rarity, title, subtitle }) => {
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
      <Text style={[styles.title, { fontFamily: 'SourceCodePro-Medium' }]}>{title}</Text>
      <Text style={[styles.subtitle, { fontFamily: 'SourceCodePro-Italic' }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 165,
  },
  image: {
    width: '100%',
    height: 165,
  },
  title: {
    fontWeight: 'bold',
    padding: 5,
    paddingBottom: 0,
  },
  subtitle: {
    fontStyle: 'italic',
    fontSize: 12,
    color: 'gray',
    padding: 5,
    paddingTop: 3,
  },
  gem: {
    position: 'absolute',
    right: 5,
    // top: -20,
    top: 5,
    width: 35,
    height: 35,
    zIndex: 1,
  },
});

export default CompactCard;
