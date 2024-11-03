import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Gem1 from './gem1.svg';
import Gem2 from './gem2.svg';
import Gem3 from './gem3.svg';
import Gem4 from './gem4.svg';

console.log('Gem1:', Gem1);
console.log('Gem2:', Gem2);
console.log('Gem3:', Gem3);
console.log('Gem4:', Gem4);
console.log('Types:', {
    Gem1: typeof Gem1,
    Gem2: typeof Gem2,
    Gem3: typeof Gem3,
    Gem4: typeof Gem4,
  });


const fetchFonts = () => {
    return Font.loadAsync({
      'SourceCodePro-Regular': require('../.././assets/fonts/SourceCodePro-Regular.ttf'),
      'SourceCodePro-Medium': require('../.././assets/fonts/SourceCodePro-Medium.ttf'),
      'SourceCodePro-Italic': require('../.././assets/fonts/SourceCodePro-Italic.ttf'),
    });
  };

const CompactCard = ({ image, rarity, title, subtitle }) => {
    console.log('Props:', { image, rarity, title, subtitle });
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
            console.log('Gem1 type:', typeof Gem1);
            return <Gem1 style={styles.gem} />;
          case "2":
            console.log('Gem2 type:', typeof Gem2);
            return <Gem2 style={styles.gem} />;
          case "3":
            console.log('Gem3 type:', typeof Gem3);
            return <Gem2 style={styles.gem} />;
          case "4":
            console.log('Gem4 type:', typeof Gem4);
            return <Gem4 style={styles.gem} />;
          default:
            return null;
        }
    };    


  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover"/>
      </View>
      <View>
        {/* {renderGem()} */}
        {/* <Text>Rarity: {String(rarity)}</Text> */}
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
    color: 'gray',
    padding: 5,
    paddingTop: 3,
  },
  gem: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 30,
    height: 30,
    zIndex: 1,
  },
});

export default CompactCard;
