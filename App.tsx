import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TimerApp from './TimerApp'; // Import TimerApp
import Home from './Home';
import StackNav from './StackNav';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
   <StackNav/>
  );
};

export default App;

const styles = StyleSheet.create({});
