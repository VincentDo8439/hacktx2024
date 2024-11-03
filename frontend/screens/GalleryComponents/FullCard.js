import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require("../.././assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require("../.././assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Italic": require("../.././assets/fonts/SourceCodePro-Italic.ttf"),
  });
};

const FullCard = ({ image, title, subtitle, facts, cityState, date }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  // Ensure all Hooks are called before any return statements
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  // Function to handle touch events
  const handleTouch = (evt) => {
    const { locationX, locationY } = evt.nativeEvent;
    const cardWidth = 300; // Adjust to your card's actual width
    const cardHeight = 500; // Adjust to your card's actual height
    const centerX = cardWidth / 2;
    const centerY = cardHeight / 2;

    const tiltX = (locationY - centerY) / centerY;
    const tiltY = (locationX - centerX) / centerX;

    rotateX.setValue(tiltX);
    rotateY.setValue(tiltY);
  };

  // PanResponder to handle touch interactions
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouch(evt);
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(rotateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(rotateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

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

  // Animated style for the card tilt effect
  const animatedStyle = {
    transform: [
      { perspective: 500 },
      {
        rotateX: rotateX.interpolate({
          inputRange: [-80, 80],
          outputRange: ["40deg", "-40deg"],
        }),
      },
      {
        rotateY: rotateY.interpolate({
          inputRange: [-50, 50],
          outputRange: ["-40deg", "40deg"],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      {...panResponder.panHandlers}
    >
      <View style={styles.background} />
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: "%100",
    height: "%100",
    borderRadius: 8,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 270,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontFamily: "SourceCodePro-Medium",
    fontSize: 22,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontFamily: "SourceCodePro-Italic",
    color: "#020202",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 4,
  },
  factsContainer: {
    marginTop: 10,
    marginBottom: -20,
  },
  fact: {
    fontFamily: "SourceCodePro-Regular",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 6,
    fontSize: 14,
    marginVertical: 2,
    color: "#666666",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#C4C4C4",
    marginVertical: 30,
    marginHorizontal: 30,
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: -10,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    marginHorizontal: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#3C3C3C",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "white",
    marginRight: 8,
  },
  tagText: {
    fontFamily: "SourceCodePro-Regular",
    fontSize: 12,
    color: "#3C3C3C",
  },
  button: {
    backgroundColor: "#3C3C4C",
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 5,
    margin: 26,
    paddingVertical: 7,
    paddingHorizontal: 10,
    paddingLeft: 14,
    paddingRight: 14,
  },
  buttonText: {
    fontFamily: "SourceCodePro-Regular",
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
});

export default FullCard;
