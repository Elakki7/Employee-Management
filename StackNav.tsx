import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home'; // Import TimerApp
import TimerApp from './TimerApp';
import Attendance from './Attendance';

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Stack.Screen name='Attendance' component={Attendance}/>
<Stack.Screen name="Task Tracker" component={TimerApp} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
