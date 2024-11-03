import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const fetchFonts = () => {
    return Font.loadAsync({
      'SourceCodePro-Regular': require('../.././assets/fonts/SourceCodePro-Regular.ttf'),
      'SourceCodePro-Medium': require('../.././assets/fonts/SourceCodePro-Medium.ttf'),
      'SourceCodePro-Italic': require('../.././assets/fonts/SourceCodePro-Italic.ttf'),
    });
  };

const CompactCard = ({ image, title, subtitle }) => {
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


  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover"/>
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
});

export default CompactCard;
