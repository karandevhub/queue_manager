import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {BASE_URL} from '../../config';
import {AppContext} from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDeviceToken} from '../utils/notifications';
import crashlytics from '@react-native-firebase/crashlytics';
const QueueForm = ({navigation}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [queueInfo, setQueueInfo] = useState(null);
  const [WaitingList, setWaitingList] = useState(0);
  const [WaitingTime, setWaitingTime] = useState('');
  const {scannedData, setUserId} = useContext(AppContext);
  const [deviceToken, setDeviceToken] = useState(null);

  useEffect(() => {
    getDeviceToken().then(token => setDeviceToken(token));
  }, []);

  const addToQueue = async () => {
    const storedQueueId = await AsyncStorage.getItem('queueID');
    const body = {
      username: name,
      phone: phoneNumber,
      deviceToken: deviceToken,
    };

    if (storedQueueId) {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/addToQueue?queueId=${storedQueueId}`,
          body,
        );
        setQueueInfo(response.data);
        setUserId?.(response.data.newUser._id);
        await AsyncStorage.setItem('newUserID', response.data.newUser._id);
        await AsyncStorage.setItem('newUserName', response.data.newUser.name);
        Alert.alert('Added to queue successfully');
      } catch (error) {
        console.error('Error adding to queue:', error);
        Alert.alert(
          'Error',
          'There was an issue adding to the queue. Please try again.',
        );
      }
    }
  };

  const fetchQueue = async () => {
    const storedQueueId = await AsyncStorage.getItem('queueID');
    if (storedQueueId) {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/fetchQueue?queueId=${storedQueueId}`,
        );
        const fetchQueueData = response?.data?.queue ?? {};
        setWaitingList(fetchQueueData?.usersList?.length ?? 0);
        const userList = fetchQueueData?.usersList ?? [];
        const totalUsers = userList.length ?? 0;

        let totalWaitingTime = 0;

        for (const user of userList) {
          const createdAt = new Date(user?.createdAt)?.getTime() ?? 0;
          const currentTime = new Date()?.getTime() ?? 0;

          totalWaitingTime += (currentTime - createdAt) / (1000 * 60);
        }

        const averageWaitingTime = totalWaitingTime / totalUsers;
        const hours = Math.floor(averageWaitingTime / 60);
        const minutes = Math.round(averageWaitingTime % 60);

        const formattedTime =
          (hours > 0 ? `${hours} hr` : '') +
          (hours > 0 && minutes > 0 ? ' ' : '') +
          (minutes > 0 ? `${minutes} min` : '');
        setWaitingTime(formattedTime);
      } catch (error) {
        console.error('fetch queue error:', error);
      }
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [queueInfo]);

  const handleJoinQueue = async () => {
    const userId = await AsyncStorage.getItem('newUserID');
    console.log('Name:', name);
    console.log('Phone Number:', phoneNumber);
    crashlytics().log('User signed in.');
    await Promise.all([
      crashlytics().setUserId(JSON.stringify(userId)),
      crashlytics().setAttributes({
        phone: phoneNumber,
        username: name,
      }),
    ]);
    addToQueue();
    setName('');
    setPhoneNumber('');
  };

  const handleCancelQueue = () => {
    setName('');
    setPhoneNumber('');
    navigation.navigate?.('QRscreen');
  };

  return (
    <View style={styles.container}>
      <View style={{marginVertical: 40}}>
        <Text style={styles.queueName}>Queue: {scannedData.queueName}</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={styles.inputContainer}>
          <Text style={styles.joinQueueText}>Join the Queue</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.queueDescriptionContainer}>
          <Text style={styles.queueInfo}>Waiting List: {WaitingList}</Text>
          <Text style={styles.queueInfo}>
            Average Waiting Time: {WaitingTime}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinQueue}>
            <Text style={styles.buttonText}>Join Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelQueue}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  queueName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  joinQueueText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  queueDescriptionContainer: {
    marginBottom: 20,
  },
  queueInfo: {
    fontSize: 18,
    color: '#777',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QueueForm;
