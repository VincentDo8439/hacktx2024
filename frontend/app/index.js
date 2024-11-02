import * as React from "react";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './theme';

export default function Index() {
  return (
    <PaperProvider theme={theme}>
        <BottomTabNavigator />
    </PaperProvider>
  );
}
