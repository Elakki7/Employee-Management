import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomePage = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-Dimensions.get('window').width));

  const handleLogOutPress = () => {
    Alert.alert('LogOut Successful!');
    navigation.navigate('LoginPage');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    Animated.timing(sidebarAnimation, {
      toValue: sidebarVisible ? -Dimensions.get('window').width : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.dashboardText}>DASHBOARD</Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.navbarButton}>
          <Text style={styles.hamburgerText}>≡</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnimation }]}>        
        <View style={styles.employeeInfo}></View>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Task Tracker')}>
          <Text style={styles.menuText}>Time Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Attendance')}>
          <Text style={styles.menuText}>Attendance</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  navbar: {
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 3,
  },
  dashboardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  hamburgerText: {
    fontSize: 30,
    color: '#333',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#34495E',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});

export default HomePage;
