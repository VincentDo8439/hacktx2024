import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapsScreen from '../screens/MapsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import CameraScreen from '../screens/CameraScreen';
import TradingScreen from '../screens/TradingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

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
            <Ionicons name="map" size={24} color={focused ? '#6200ee' : '#222'} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="images" size={24} color={focused ? '#6200ee' : '#222'} />
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
            <Ionicons name="swap-horizontal" size={24} color={focused ? '#6200ee' : '#222'} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person" size={24} color={focused ? '#6200ee' : '#222'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const CustomCameraButton = ({ onPress }) => (
  <TouchableOpacity style={styles.cameraButton} onPress={onPress}>
    <Ionicons name="camera" size={32} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 10,
    paddingTop: 10,
  },
  cameraButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default BottomTabNavigator;
