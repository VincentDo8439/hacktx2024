import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import FinalizeTrade from "../screens/TradingComponents/FinalizeTrade";
import InitiateTrade from "../screens/TradingComponents/InitiateTrade";
import Animated, { BounceIn } from "react-native-reanimated";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function TradeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Initiate" component={InitiateTrade} />
      <Stack.Screen name="Finalize" component={FinalizeTrade} />
    </Stack.Navigator>
  );
}
