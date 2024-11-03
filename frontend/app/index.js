import * as React from "react";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../contexts/AuthContext";
import { theme } from "./theme";
import StackNavigator from "../navigation/StackNavigator";



export default function Index() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StackNavigator/>
      </AuthProvider>
    </PaperProvider>
  );
}
