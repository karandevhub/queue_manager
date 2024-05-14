import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Button,
} from 'react-native';
import {
  Camera,
  getCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {AppContext} from '../context/Context';
import axios from 'axios';
import {getUniqueId} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

const QRscreen = props => {
  const [hasPermission, setHasPermission] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const devices = Camera.getAvailableCameraDevices();

  const camera = useRef(null);
  const {
    handleQRScanSuccess,
    showScanner,
    setShowScanner,
    device,
    setDevice,
    getActiveQueue,
  } = useContext(AppContext);
  
  /*          Handled Camera Permissions        */

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Camera permission required to scan QR codes.');
      return;
    }
  };

  if (!device) {
    return <ActivityIndicator />;
  }
  const handleCameraError = e => {
    console.log('error', e);
  };

  /*       Handled QR Scan          */

  const handleQRScan = async () => {
    await setTimeout(() => {
      setDevice(getCameraDevice(devices, 'back'));
    }, 2000);
    setShowScanner(true);
  };

  const codeScanner = useCodeScanner?.({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async codes => {
      handleQRScanSuccess?.(codes);
      await getActiveQueue?.(codes);
      try {
        const storedQueueId = await AsyncStorage.getItem('queueID');
        console.log(storedQueueId, 'stored queue id');
        if (storedQueueId) {
          props.navigation.navigate('QueueForm');
        } else {
          Alert.alert('No active queue found');
        }
      } catch (error) {
        console.error('Error retrieving queueID:', error);
        Alert.alert('Error retrieving queueID');
      }
    },
  });

  /*       return section       */

  const getBusiness = async () => {
    setBusinessLoading(true);
    try {
      const deviceID = await getUniqueId();
      console.log(deviceID);
      const url = `https://token-app-backend.vercel.app/api/v1/admin/getBusinessByDeviceId?deviceId=${deviceID}`;
      const response = await axios.get(url);
      ToastAndroid.show('Business found', ToastAndroid.SHORT);
      props.navigation.navigate('AdminDetails', {
        businessId: response?.data?.business?._id,
        businessName: response?.data?.business?.name,
      });
      // console.log(businessId);
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        'No business available! Create one',
        ToastAndroid.SHORT,
      );
      props.navigation.navigate('AdminLogin');
    } finally {
      setBusinessLoading(false);
    }
  };

  return showScanner && hasPermission ? (
    <View style={{flex: 1}}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        isActive={hasPermission}
        device={device}
        onError={handleCameraError}
        codeScanner={codeScanner}
      />
      <View style={styles.cameraOverlay}>
        <Text
          style={{
            position: 'absolute',
            color: 'white',
            top: '30%',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Scan QR
        </Text>
        <View style={styles.squareFrame} />
      </View>
    </View>
  ) : (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleQRScan}>
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>or</Text>
        <TouchableOpacity style={styles.button} onPress={getBusiness}>
          <Text style={styles.buttonText}>
            {businessLoading ? 'Searching Business...' : 'Admin'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,

    borderRadius: 8,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'red',
    opacity: 0.5,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  cancelBtn: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
  },
});

export default QRscreen;
