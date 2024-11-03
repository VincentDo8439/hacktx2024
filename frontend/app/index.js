import * as React from "react";
import MainNavigator from "../navigation/MainNavigator";
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from './theme';import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true); // Ignore all log notifications

export default function Index() {
  return (
    <PaperProvider theme={theme}>
        <MainNavigator />
    </PaperProvider>
  );
}
