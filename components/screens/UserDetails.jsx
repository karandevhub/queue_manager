import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {AppContext} from '../context/Context';
import {BASE_URL} from '../../config';
import axios from 'axios';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
const UserProfile = () => {
  const [WaitingList, setWaitingList] = useState(0);
  const [WaitingTime, setWaitingTime] = useState('');
  const [userName, setUserName] = useState('demo');
  const [queuedata, setQueueData] = useState(null);

  const {
    userid,
    queueid,
    deleteUser,
    scannedData,
    refreshing,
    setRefreshing,
    getActiveQueue,
  } = useContext(AppContext);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQueue();
    await getActiveQueue();
    setRefreshing(false);
  };

  const removeFromQueue = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove from the queue?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled removing from queue'),
          style: 'cancel',
        },
        {text: 'Remove', onPress: () => handleRemoveConfirmation()},
      ],
      {cancelable: false},
    );
  };

  const handleRemoveConfirmation = () => {
    removeQueue();
  };
  /*       remove from  queue    */

  const removeQueue = async () => {
    await axios
      .delete(
        `${BASE_URL}/user/removeFromQueue?userId=${userid}&queueId=${queueid}`,
      )
      .then(response => {
        deleteUser?.();
      })
      .catch(error => {
        console.error('fetch queue error:', error);
      });
  };

  /*       fetch queue    */

  const fetchQueue = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/fetchQueue?queueId=${queueid}`,
      );
      const fetchQueueData = response?.data?.queue ?? {};
      const userList = fetchQueueData?.usersList ?? [];
      const totalUsers = userList.length ?? 0;
      let userPosition = -1;
      let userWaitingTime = 0;

      if (totalUsers === 0) {
        setWaitingList(0);
        setWaitingTime('0 min');
        return;
      }

      userList.forEach((user, index) => {
        if (user?._id === userid) {
          userPosition = index + 1;
          setUserName(user?.name);
          const createdAt = new Date(user?.createdAt)?.getTime() ?? 0;
          const currentTime = new Date()?.getTime() ?? 0;
          userWaitingTime = (currentTime - createdAt) / (1000 * 60);
          console.log(userWaitingTime);
        }
      });

      if (userPosition === -1) {
        console.log('User not found in the queue');
        return;
      }
      const adjustedWaitingTime = userWaitingTime * (userPosition / totalUsers);
      const hours = Math.floor(adjustedWaitingTime / 60);
      const minutes = Math.round(adjustedWaitingTime % 60);

      const formattedTime =
        (hours > 0 ? `${hours} hr` : '') +
        (hours > 0 && minutes > 0 ? ' ' : '') +
        (minutes > 0 ? `${minutes} min` : '');

      setWaitingList(totalUsers);
      setWaitingTime(formattedTime);
    } catch (error) {
      console.error('fetch queue error:', error);
    }
  };

  const getQeueueData = async () => {
    try {
      let queuedata = await AsyncStorage.getItem('scannedData');
      let Jsondata = await JSON.parse(queuedata);
      setQueueData(Jsondata);
      return Jsondata;
    } catch (error) {
      console.error('Error fetching queuedata:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getQeueueData?.();
      if (data) {
        fetchQueue?.();
      }
    };
    fetchData?.();
    getActiveQueue?.();
    crashlytics().log("user logedd in")
  }, [refreshing]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {queuedata && (
        <View style={styles.header}>
          <Text style={styles.queueName}>{queuedata.data.queueName}</Text>
          <Text style={styles.queueDescription}>
            {queuedata.data.businessDescription}
          </Text>
        </View>
      )}

      <View style={styles.userInfo}>
        {scannedData ? (
          <View>
            <Text style={styles.userInfoText}>Username:{userName}</Text>
            <Text style={styles.userInfoText}>Waiting List:{WaitingList}</Text>
            <Text style={styles.userInfoText}>
              Average Waiting Time:{WaitingTime}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={{fontSize: 25, marginVertical: 30, textAlign: 'center'}}>
              Queue is not active
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={removeFromQueue}>
        <Text style={styles.buttonText}>Remove from Queue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  queueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  queueDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfile;
