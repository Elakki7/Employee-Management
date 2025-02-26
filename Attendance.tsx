import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView, Button, Alert, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import DeviceInfo from 'react-native-device-info';

const CalendarComponent = ({ completedDays }: { completedDays: Record<string, any> }) => {
  const [date, setDate] = useState('');
  const [taskType, setTaskType] = useState('TASK');
  const [priority, setPriority] = useState('Critical');
  const [taskStatus, setTaskStatus] = useState('To-Do');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [actualTime, setActualTime] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [branchName, setBranchName] = useState('');
  const [prLink, setPrLink] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isCalendarVisible, setCalendarVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };

    fetchDeviceId();
  }, []);

  // Mark the selected date and other days
  const markDays = () => {
    const updatedDays = { ...completedDays };

    if (selectedDate) {
      updatedDays[selectedDate] = { selected: true, selectedColor: '#FFD700' };
    }

    return updatedDays;
  };

  // Handle the day press to select a date for task entry
  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setDate(day.dateString);
  };

  // Handle the completion date selection inside the modal
  const handleCompletionDatePress = (day: any) => {
    setCompletionDate(day.dateString);
    setCalendarVisible(false); // Close the modal after selecting the date
  };

  const handleSubmit = async () => {
    const formData = {
      date,
      task_type: taskType,
      priority,
      task_status: taskStatus,
      estimated_time: estimatedTime,
      actual_time_taken: actualTime,
      task_description: taskDescription,
      branch_name: branchName,
      pr_link: prLink,
      completion_date: completionDate,
      device_id: deviceId,  // Add device ID if needed for tracking
    };

    // Show form data in an alert (debugging purpose)
    Alert.alert('Form Submitted', JSON.stringify(formData, null, 2));

    try {
      const response = await fetch('https://ab54-59-97-51-97.ngrok-free.app/dailytask/post-task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Form submitted successfully');
      } else {
        // Log response to get more info about the error
        console.log('Error Response:', result);
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      // Log any network or server connection issues
      console.log('Network Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server');
    }
 
    // Reset form fields
    setDate('');
    setTaskType('TASK');
    setPriority('Critical');
    setTaskStatus('To-Do');
    setEstimatedTime('');
    setActualTime('');
    setTaskDescription('');
    setBranchName('');
    setPrLink('');
    setSelectedDate('');
    setCompletionDate('');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Attendance Calendar</Text>

        {/* Calendar Component */}
        <Calendar
          markedDates={markDays()}
          style={styles.calendar}
          theme={{
            calendarBackground: '#f9f9f9',
            textSectionTitleColor: '#2C2C2C',
            todayTextColor: '#1976D2',
            dayTextColor: '#444',
            selectedDayBackgroundColor: '#FFD700',
            selectedDayTextColor: '#fff',
          }}
          onDayPress={handleDayPress}
        />

        <Text style={styles.deviceInfoText}>Device ID: {deviceId}</Text>
        <Text style={styles.displayText}>Date</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Enter date" placeholderTextColor="#888" />

        {/* Task Type */}
        <Text style={styles.displayText}>Task Type</Text>
        <Picker selectedValue={taskType} style={styles.picker} onValueChange={setTaskType}>
          <Picker.Item label="TASK" value="TASK" />
          <Picker.Item label="BUG" value="BUG" />
        </Picker>

        {/* Priority */}
        <Text style={styles.displayText}>Priority</Text>
        <Picker selectedValue={priority} style={styles.picker} onValueChange={setPriority}>
          <Picker.Item label="Critical" value="Critical" />
          <Picker.Item label="High" value="High" />
          <Picker.Item label="Low" value="Low" />
        </Picker>

        <Text style={styles.displayText}>Estimated Time</Text>
        <TextInput style={styles.input} value={estimatedTime} onChangeText={setEstimatedTime} placeholder="Enter estimated time" placeholderTextColor="#888" />

        <Text style={styles.displayText}>Actual Time Taken</Text>
        <TextInput style={styles.input} value={actualTime} onChangeText={setActualTime} placeholder="Enter actual time taken" placeholderTextColor="#888" />

        <Text style={styles.displayText}>Task Description</Text>
        <TextInput style={styles.input} value={taskDescription} onChangeText={setTaskDescription} placeholder="Enter task description" placeholderTextColor="#888" />

        {/* Task Status */}
        <Text style={styles.displayText}>Task Status</Text>
        <Picker selectedValue={taskStatus} style={styles.picker} onValueChange={setTaskStatus}>
          <Picker.Item label="To-Do" value="To-Do" />
          <Picker.Item label="In-Progress" value="In-Progress" />
          <Picker.Item label="Committed" value="Committed" />
          <Picker.Item label="Completed" value="Completed" />
          <Picker.Item label="Deferred" value="Deferred" />
        </Picker>

        <Text style={styles.displayText}>Branch Name</Text>
        <TextInput style={styles.input} value={branchName} onChangeText={setBranchName} placeholder="Enter branch name" placeholderTextColor="#888" />

        <Text style={styles.displayText}>PR Link</Text>
        <TextInput style={styles.input} value={prLink} onChangeText={setPrLink} placeholder="Enter PR link" placeholderTextColor="#888" />

        {/* Completion Date */}
        <Text style={styles.displayText}>Completion Date</Text>
        <TouchableOpacity onPress={() => setCalendarVisible(true)} style={styles.completionDateButton}>
          <Text style={{ color: completionDate ? '#000' : '#888' }}>
            {completionDate || 'Select Completion Date'}
          </Text>
        </TouchableOpacity>

        {/* Completion Date Modal */}
        <Modal visible={isCalendarVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Calendar onDayPress={handleCompletionDatePress} />
            <Button title="Close" onPress={() => setCalendarVisible(false)} />
          </View>
        </Modal>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#EDEDED' 
  },
  calendar: { 
    marginBottom: 20, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#DDD' 
  },
  headerText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#333', 
    marginBottom: 10 
  },
  deviceInfoText: { 
    fontSize: 14, 
    color: '#333', 
    textAlign: 'center', 
    alignSelf: 'center', 
    marginBottom: 10 
  },
  displayText: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 5 
  },
  input: { 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#CCC', 
    paddingHorizontal: 15, 
    borderRadius: 8, 
    backgroundColor: '#FFF', 
    marginBottom: 10 
  },
  picker: { 
    height: 50, 
    backgroundColor: '#FFF', 
    marginBottom: 10 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20 
  },
  buttonContainer: { 
    marginTop: 20, 
    borderRadius: 8 
  },
  completionDateButton: {
    marginTop: 20, 
    borderRadius: 8 ,
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#CCC', 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    marginBottom: 1,
    
    
  },
});


export default CalendarComponent;