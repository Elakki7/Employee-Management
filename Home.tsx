import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';

const HomePage = ({ navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarAnimation] = useState(new Animated.Value(-Dimensions.get('window').width * 0.75));

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    Animated.timing(sidebarAnimation, {
      toValue: sidebarVisible ? -Dimensions.get('window').width * 0.75 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3498db" />
      
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.dashboardText}>DASHBOARD</Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.navbarButton} activeOpacity={0.6}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay for Sidebar Effect */}
      {sidebarVisible && <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnimation }] }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
        </View>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Task Tracker')} activeOpacity={0.7}>
          <Text style={styles.menuText}>🕒 Time Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Attendance')} activeOpacity={0.7}>
          <Text style={styles.menuText}>📅 Attendance</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  navbar: {
    height: 80, // Increased height slightly
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 5,
    paddingTop: StatusBar.currentHeight, // Ensures proper alignment on Android
  },
  dashboardText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  hamburgerText: {
    fontSize: 28,
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0, // Ensures sidebar starts from the very top
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    zIndex: 2,
  },
  sidebarHeader: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 18,
    color: '#2c3e50',
  },
});

export default HomePage;
