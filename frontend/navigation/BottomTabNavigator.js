import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapsScreen from "../screens/MapsScreen";
import GalleryScreen from "../screens/GalleryScreen";
import CameraScreen from "../screens/CameraScreen";
import TradingScreen from "../screens/TradingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated, { BounceIn } from "react-native-reanimated";

const Tab = createBottomTabNavigator();

const AnimatedIcon = ({ name, focused }) => (
  <Animated.View entering={BounceIn}>
    <Ionicons name={name} size={24} color={focused ? "#6200ee" : "#222"} />
  </Animated.View>
);

const AnimatedMaterialIcon = ({ name, focused }) => (
  <Animated.View entering={BounceIn}>
    <MaterialCommunityIcons
      name={name}
      size={24}
      color={focused ? "#6200ee" : "#222"}
    />
  </Animated.View>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Maps"
        component={MapsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="map" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="images" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarButton: (props) => <CustomCameraButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Trading"
        component={TradingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedMaterialIcon
              name="swap-horizontal-bold"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="person" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const CustomCameraButton = ({ onPress }) => (
  <Animated.View entering={BounceIn}>
    <TouchableOpacity style={styles.cameraButton} onPress={onPress}>
      <Ionicons name="camera" size={32} color="#fff" />
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    height: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    // Shadow properties for iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // Elevation for Android
    elevation: 10,
  },
  cameraButton: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6200ee",
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default BottomTabNavigator;
