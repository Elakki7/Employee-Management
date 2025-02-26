import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';

// Get today's date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const TimerApp = ({ completedDays }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [deviceID, setDeviceID] = useState(null);

  // Mark the selected date and other days
  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceID(id);
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    requestLocationPermission(); // Ask for location permission on startup
    return () => clearInterval(timerRef.current); // Cleanup interval on unmount
  }, []);

  // Request Location Permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          setLocationError('Permission denied');
        }
      } catch (err) {
        setLocationError('Error requesting permission');
      }
    } else {
      getLocation(); // iOS permissions are handled automatically
    }
  };

  // Get Current Location
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log(position.coords.latitude, position.coords.longitude)
        setLocationError(null); // Clear previous errors
      },
      (error) => {
        setLocationError(error.message);
        setLatitude(null);
        setLongitude(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  // Start Timer Function
  const sendPostRequest = (status) => {
    const payload = {
      device_id: deviceID
    };
    
    fetch(`https://f1e9-59-97-51-97.ngrok-free.app/thiran_attendance/attendance/${status}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => console.log('Response:', data))
      .catch(error => console.error('Error:', error));
  };

  const startTimer = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 100);
      sendPostRequest('start');
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      sendPostRequest('pause');
    }
  };

  const endTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    alert(`Final Time: ${formatTime(elapsedTime)}`);
    setElapsedTime(0);
    startTimeRef.current = 0;
    sendPostRequest('stop');
  };

  // Format Time
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Determine color for today's date only
  const getTodayColor = () => {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    if (totalSeconds >= 20) return 'green';  // Change to green after 20s
    if (totalSeconds >= 10) return 'blue';   // Change to blue after 10s
    return '#FFD700'; // Default gold color
  };

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={{
            ...completedDays, // Keep previous completed dates
            [selectedDate]: { selected: true, selectedColor: selectedDate === getCurrentDate() ? getTodayColor() : '#FFD700' },
          }}
          style={styles.calendar}
          theme={{
            calendarBackground: '#f9f9f9',
            textSectionTitleColor: '#2C2C2C',
            todayTextColor: '#1976D2',
            dayTextColor: '#444',
            selectedDayTextColor: '#fff',
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
      </View>

      {/* Location Info */}
      <Text style={styles.locationText}>
        {locationError ? `Error: ${locationError}` : `Latitude: ${latitude}`}
      </Text>
      <Text style={styles.locationText}>
        {locationError ? `Error: ${locationError}` : `Longitude: ${longitude}`}
      </Text>

      {/* Refresh Location Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
        <Text style={styles.buttonText}>Refresh Location</Text>
      </TouchableOpacity>

      <View style={styles.space} />

      {/* Timer */}
      <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>

      {/* Timer Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, isRunning && styles.disabledButton]} onPress={startTimer} disabled={isRunning}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, !isRunning && styles.disabledButton]} onPress={pauseTimer} disabled={!isRunning}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={endTimer}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  space: {
    padding: 20,
  },
});

export default TimerApp;
