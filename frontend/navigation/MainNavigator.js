import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import Animated, { BounceIn } from "react-native-reanimated";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
