import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/EvilIcons';
import QrCode from 'react-native-qrcode-svg';
import axios from 'axios';

const AdminDetails = props => {
  const {businessId, businessName} = props.route.params;
  // console.log(businessId, 'businessId');
  const [refresh, setRefresh] = useState(false);

  const [business, setBusiness] = useState(null);
  const [activeQueue, setActiveQueue] = useState(null);
  const [initialLoad, setinitialLoad] = useState(false);
  const [newQueue, setNewQueue] = useState(false);
  const [newQueueName, setNewQueueName] = useState('');
  const [isPrevQueueToday, setIsPrevQueueToday] = useState(false);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [users, setUsers] = useState(0);

  const getBusiness = async () => {
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/getBusiness?businessId=${businessId}`;
      const response = await axios.get(url);
      // console.log(response?.data?.business);
      setBusiness(response?.data?.business);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(users, 'users');
  // console.log(isPrevQueueToday, 'isPrevQueueToday');

  const getActiveQueue = async () => {
    setRefresh(true);
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/getActiveQueue?businessId=${businessId}`;
      const response = await axios.get(url);
      const data = response?.data?.activeQueue[0];
      // console.log(data, 'data');
      if (data) {
        ToastAndroid.show('Active queue found', ToastAndroid.SHORT);
        setActiveQueue(data);
      } else {
        ToastAndroid.show('No active queue found', ToastAndroid.SHORT);
        setActiveQueue(null);
      }
    } catch (error) {
      console.log(error, 'error getActiveQueue');
    } finally {
      setRefresh(false);
    }
  };

  const getUsers = async () => {
    try {
      setRefresh(true);
      const response = await axios.get(
        `https://token-app-backend.vercel.app/api/v1/admin/fetchQueue?queueId=${activeQueue?._id}`,
      );
      // console.log(response, 'response');
      const data = response?.data?.queue?.usersList;
      const totalUsers = data?.length;
      setUsers(totalUsers || 0);
      const pendingusers = data?.filter(user => user?.isDone === false);
      setPendingUsers(pendingusers?.length || 0);
      // console.log(data, 'data');
    } catch (err) {
      console.log(err);
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [activeQueue]);

  const checkExistingQueue = async () => {
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/getTodayQueue?businessId=${businessId}`;
      const response = await axios.get(url);
      const data = response?.data;
      // console.log(data, 'data');
      if (data) {
        ToastAndroid.show('Queue already created', ToastAndroid.SHORT);
        setIsPrevQueueToday(data?.todayQueue);
      } else {
        ToastAndroid.show('No queue found', ToastAndroid.SHORT);
        setNewQueue(true);
      }
    } catch (error) {
      console.log(error, 'error checkExistingQueue');
      setNewQueue(true);
    } finally {
      setinitialLoad(false);
    }
  };

  // console.log(isPrevQueueToday, 'prevQueueToday');

  const disableQueue = async () => {
    try {
      const res = await axios.patch(
        `https://token-app-backend.vercel.app/api/v1/admin/stopQueue?queueId=${activeQueue?._id}`,
      );
      ToastAndroid.show('Queue stopped', ToastAndroid.SHORT);
      // console.log(res, 'res');
    } catch (error) {
      console.log(error, 'error disableQueue');
    } finally {
      await getActiveQueue();
    }
  };

  const createQueue = async () => {
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/createQueue?businessId=${businessId}`;
      await axios.post(url, {
        queueName: newQueueName,
      });
      // console.log(response?.data, 'response');
    } catch (error) {
      console.log(error, 'error createQueue');
    } finally {
      await getActiveQueue();
      setNewQueue(false);
    }
  };

  const enableQueue = async () => {
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/enableQueue?queueId=${isPrevQueueToday[0]?._id}`;
      await axios.patch(url);
      // console.log(response?.data, 'response');
    } catch (error) {
      console.log(error, 'error enableQueue');
    } finally {
      await getActiveQueue();
    }
  };

  useEffect(() => {
    getBusiness();
  }, []);

  useEffect(() => {
    setinitialLoad(true);
    getActiveQueue();
    setinitialLoad(false);
  }, []);

  useEffect(() => {
    checkExistingQueue();
  }, []);
  // console.log(business)

  // console.log(activeQueue, 'activeQueue');

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Business Name:</Text>
          <Text style={styles.detailValue}>{business?.name}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Description:</Text>
          <Text style={styles.detailValue}>{business?.description}</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.qrCodesHeading}>Your QR:</Text>
          <QrCode value={JSON.stringify(businessId)} size={200} />
        </View>
      </View>
      {activeQueue ? (
        <View
          style={{
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Text style={styles.qrCodesHeading}>Active Queue:</Text>
            <Text style={styles.qrCodesHeading}>{activeQueue?.queueName}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                padding: 10,
                flex: 1,
              }}>
              <Text style={styles.qrCodesHeading}>Total users:</Text>
              <Text style={styles.qrCodesHeading}>{users}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                padding: 10,
                flex: 1,
              }}>
              <Text style={styles.qrCodesHeading}>Pending users:</Text>
              <Text style={styles.qrCodesHeading}>{pendingUsers}</Text>
            </View>
          </View>
          <View style={styles.btnGrp}>
            <TouchableOpacity
              style={styles.btns}
              onPress={() => {
                disableQueue();
                getActiveQueue();
                setActiveQueue(null);
              }}>
              <Text style={styles.btnText}>Stop Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btns} onPress={getUsers}>
              <Text style={styles.btnText}>
                {refresh ? 'Refreshing' : 'Refresh'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btns}
              onPress={() => {
                props.navigation.navigate('QueueDetails', {
                  queueId: activeQueue?._id,
                  queueName: activeQueue?.queueName,
                });
              }}>
              <Text style={styles.btnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {isPrevQueueToday[0]?._id ? (
            <View
              style={{
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                padding: 10,
              }}>
              <Text style={styles.qrCodesHeading}>No Active Queue</Text>
              <View>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'justify',
                  }}>
                  Queue for today is already created. You can resume it.
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 18,
                      fontWeight: '300',
                      textAlign: 'justify',
                      flex: 1,
                      justifyContent: 'space-between',
                      gap: 10,
                    }}>
                    Queue Name:
                    <Text
                      style={{
                        color: 'blue',
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginLeft: 10,
                      }}>
                      {isPrevQueueToday[0]?.queueName}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.resumeBtn}
                    onPress={enableQueue}>
                    <Text style={styles.qrScannerText}>Resume Queue</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  You can view your previous queue details in the calendar.
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                padding: 10,
              }}>
              <Text style={styles.qrCodesHeading}>No Active Queue</Text>
              <TouchableOpacity
                style={styles.btns}
                onPress={() => {
                  checkExistingQueue();
                }}>
                <Text style={styles.qrScannerText}>Generate Queue</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {initialLoad && (
        <View>
          <Text style={styles.qrCodesHeading}>Loading...</Text>
        </View>
      )}
      <View>
        <TouchableOpacity
          style={styles.qrScannerButton}
          onPress={() =>
            props.navigation.navigate('AdminCalendar', {
              businessId: businessId,
              businessName: businessName,
            })
          }>
          <Text style={styles.qrScannerText}>Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* create new queue modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={newQueue}
        onRequestClose={() => {
          setNewQueue(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '90%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.qrCodesHeading}>Create New Queue</Text>
              <TouchableOpacity onPress={() => setNewQueue(false)}>
                <Icon name="close" size={30} color="#333" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 20,
                color: '#333',
              }}>
              Create new queue
            </Text>
            <Text style={{color: 'black', fontSize: 20}}>Queue Name:</Text>
            <TextInput
              placeholder="Enter queue name"
              style={{
                borderWidth: 1,
                borderColor: '#333',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginBottom: 10,
                width: '100%',
                color: '#333',
              }}
              value={newQueueName}
              onChangeText={setNewQueueName}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#3498db',
                paddingVertical: 15,
                paddingHorizontal: 30,
                borderRadius: 8,
                alignSelf: 'center',
              }}
              onPress={createQueue}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  btnGrp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    color: '#555',
    fontSize: 16,
  },
  qrCodesHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  qrCode: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  queueListHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  qrScannerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 4,
  },
  qrScannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resumeBtn: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDetails;
