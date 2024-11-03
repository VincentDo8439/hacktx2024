import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Linking
} from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import Gem1 from "./gem1.png";
import Gem2 from "./gem2.png";
import Gem3 from "./gem3.png";
import Gem4 from "./gem4.png";

const fetchFonts = () => {
  return Font.loadAsync({
    "SourceCodePro-Regular": require("../.././assets/fonts/SourceCodePro-Regular.ttf"),
    "SourceCodePro-Medium": require("../.././assets/fonts/SourceCodePro-Medium.ttf"),
    "SourceCodePro-Italic": require("../.././assets/fonts/SourceCodePro-Italic.ttf"),
  });
};

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function generateRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 25) + 25; // 25% to 50%
  const lightness = Math.floor(Math.random() * 10) + 80; // 80% to 90%
  return hslToHex(hue, saturation, lightness);
}

const Shimmer = ({ style, rarity, cardWidth }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  const shimmerOpacity = 0.25 + (rarity - 1) * 0.1; // Rarity 1: 0.25, Rarity 4: 1

  // Set shimmer color based on rarity
  const shimmerColors =
    rarity === 4
      ? ["transparent", `rgba(255, 215, 0, ${shimmerOpacity})`, "transparent"] // Golden color for rarity 4
      : ["transparent", `rgba(255,255,255,${shimmerOpacity})`, "transparent"]; // Default color for other rarities

  return (
    <View style={[styles.shimmerWrapper, style]}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const FullCard = ({
  image,
  rarity,
  title,
  subtitle,
  facts,
  cityState,
  date,
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const loadResources = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fetchFonts();
        setFontLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);

  const gradientColors = useMemo(
    () => [generateRandomPastelColor(), generateRandomPastelColor()],
    []
  );

  const renderGem = (rarity) => {
    let gemSource;
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

  const rotation = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.timing(rotation, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(rotation, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["10deg", "-10deg"],
  });

  return (
    <View
      style={styles.cardWrapper}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width);
      }}
    >
      <TouchableWithoutFeedback onPressIn={animateIn} onPressOut={animateOut}>
        <Animated.View style={{ transform: [{ rotateY: rotate }] }}>
          <LinearGradient colors={gradientColors} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View>{renderGem(rarity)}</View>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Linking.openURL("https://en.wikipedia.org/wiki/Raccoon")
              }
            >
              <Text style={styles.buttonText}>Number Caught: 1</Text>
            </TouchableOpacity>
          </LinearGradient>
          {cardWidth > 0 && <Shimmer rarity={rarity} cardWidth={cardWidth} />}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    overflow: "hidden",
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    overflow: "hidden",
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 270,
  },
  image: {
    width: "100%",
    height: 270,
  },
  title: {
    fontFamily: "SourceCodePro-Medium",
    fontSize: 22,
    paddingLeft: 15,
    paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 5,
  },
  subtitle: {
    fontFamily: "SourceCodePro-Italic",
    color: "#020202",
    paddingLeft: 15,
    paddingRight: 30,
    paddingBottom: 4,
  },
  factsContainer: {
    marginTop: 10,
    marginBottom: -20,
  },
  fact: {
    fontFamily: "SourceCodePro-Regular",
    paddingLeft: 15,
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
    marginHorizontal: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: -10,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 20,
    marginHorizontal: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#3C3C3C",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
    marginHorizontal: 15,
    margin: 26,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  buttonText: {
    fontFamily: "SourceCodePro-Regular",
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  gem: {
    position: "absolute",
    right: 12,
    top: 5,
    width: 70,
    height: 70,
    zIndex: 1,
  },
});

export default FullCard;
