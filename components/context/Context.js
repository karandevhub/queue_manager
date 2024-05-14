import {createContext, useCallback, useEffect, useState} from 'react';
import {Camera, getCameraDevice} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../config';
export const AppContext = createContext();

export const ContextProvider = ({children}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [userid, setUserId] = useState(null);
  const [queuedata, setQueueData] = useState(null);
  const [queueid, setQueueId] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const devices = Camera.getAvailableCameraDevices();
  const [device, setDevice] = useState(getCameraDevice(devices, 'front'));
  const [refreshing, setRefreshing] = useState(false);

  /*           handle QR Scan Sucess         */

  const handleQRScanSuccess = useCallback(
    async e => {
      try {
        await setDevice(getCameraDevice(devices, 'front'));
        setShowScanner(false);
        const id = await JSON.parse(e[0]?.value);
        console.log('my id', id);
        setBusinessId(id);
        await AsyncStorage.setItem('businessId', id);
      } catch (error) {
        console.error('Error parsing QR data:', error);
      }
    },
    [devices],
  );

  const getActiveQueue = async e => {
    try {
      const id =
        Array.isArray(e) && e.length > 0 ? JSON.parse(e[0]?.value) : null;
      const storedBusinessId = await AsyncStorage.getItem('businessId');
      const data = id || storedBusinessId;
      if (data) {
        setBusinessId(data);
        const response = await axios.get(
          `${BASE_URL}/user/getActiveQueue?businessId=${data}`,
        );
        console.log(response.data);

        if (response.data?.data) {
          setScannedData(response.data.data);
          setQueueId(response.data.data.queueId);
          await AsyncStorage.setItem('queueID', response.data.data.queueId);
          await AsyncStorage.setItem(
            'scannedData',
            JSON.stringify(response.data),
          );
        }
      } else {
        console.log('No data available');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No active queue found', error.response.data);
      } else {
        console.error('Error fetching active queue:', error);
      }
    }
  };

  const isUserInQueue = async () => {
    try {
      const QueueId = await AsyncStorage.getItem('queueID');
      const UserId = await AsyncStorage.getItem('newUserID');
      const queuedata = await AsyncStorage.getItem('scannedData');
      const Jsondata = JSON.parse(queuedata || '{}');
      setQueueId(QueueId);
      setQueueData(Jsondata);
      setUserId(UserId);
    } catch (e) {
      console.log('Error fetching data:', e);
    }
  };

  const deleteUser = async () => {
    await AsyncStorage.clear();
    setUserId(null);
  };

  useEffect(() => {
    isUserInQueue();
  }, []);

  return (
    <AppContext.Provider
      value={{
        handleQRScanSuccess,
        showScanner,
        setShowScanner,
        scannedData,
        device,
        setDevice,
        userid,
        queueid,
        setUserId,
        deleteUser,
        isUserInQueue,
        businessId,
        getActiveQueue,
        queuedata,
        refreshing,
        setRefreshing,
      }}>
      {children}
    </AppContext.Provider>
  );
};
