import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import CurrentTrades from "../screens/TradingComponents/CurrentTrades";
import InitiateTrade from "../screens/TradingComponents/InitiateTrade";
import Animated, { BounceIn } from "react-native-reanimated";

const Tab = createMaterialTopTabNavigator();

const AnimatedIcon = ({ name, focused }) => (
  <Animated.View entering={BounceIn}>
    <Ionicons name={name} size={24} color={focused ? "#68b2e3" : "#000"} />
  </Animated.View>
);

export default function TopTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.tabBarIndicator
      }}
    >
      <Tab.Screen
        name="Current"
        component={CurrentTrades}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="alarm" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Inititate"
        component={InitiateTrade}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedIcon name="add" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#ffffff", // Background color of the tab bar
    elevation: 0, // Remove shadow on Android
    height: 60, // Height of the tab bar
    paddingTop: 10, // Padding at the top
  },
  tabBarIndicator: {
    backgroundColor: "#68b2e3", // Color of the active tab indicator
    height: 3,
  }
});
