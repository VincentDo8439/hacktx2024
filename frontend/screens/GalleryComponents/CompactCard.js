import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
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

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');

  let r, g, b;

  if (hex.length === 3) {
    // If the hex code is in shorthand form (#abc), convert it to full form (#aabbcc)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null;
  }

  return { r, g, b };
}

// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l;

  l = (max + min) / 2;

  if (max === min) {
    // Achromatic (gray)
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s, l };
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  h /= 360;

  let r, g, b;

  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

// Function to get a lighter version of the hex color
function getLightColor(hexColor) {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor; // Return the original color if invalid hex
  let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Increase the lightness to 90%
  hsl.l = 0.9;

  const rgbLight = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(rgbLight.r, rgbLight.g, rgbLight.b);
}

const CompactCard = ({ image, rarity, title, subtitle, hexCode }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding
        await fetchFonts(); // Load fonts
        setFontLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        await SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
      }
    };

    loadResources();
  }, []);

  const renderGem = (rarity) => {
    let gemSource;
    const rarityStr = String(rarity);

    switch (rarityStr) {
      case '1':
        gemSource = Gem1;
        break;
      case '2':
        gemSource = Gem2;
        break;
      case '3':
        gemSource = Gem3;
        break;
      case '4':
        gemSource = Gem4;
        break;
      default:
        return null;
    }

    return <Image source={gemSource} style={styles.gem} />;
  };

  if (!fontLoaded) {
    return null; // Render nothing while fonts are loading
  }

  // Get the lighter version of the hexCode
  const lightBackgroundColor = getLightColor(hexCode);

  return (
    <View style={[styles.card, { backgroundColor: lightBackgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      </View>
      <View>{renderGem(rarity)}</View>
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
    // backgroundColor will be set dynamically
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
    top: 5,
    width: 35,
    height: 35,
    zIndex: 1,
  },
});

export default CompactCard;
