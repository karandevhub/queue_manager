import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {ContextProvider} from './components/context/Context';
import StackNav from './components/Navigations/StackNav';
import SplashScreen from './components/screens/SplashScreen';
import messaging from '@react-native-firebase/messaging';
import {
  getDeviceToken,
  notificationListener,
  requestUserPermission,
} from './components/utils/notifications';
import crashlytics from '@react-native-firebase/crashlytics';

const App = () => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    getDeviceToken();
    requestUserPermission();
    notificationListener();
    crashlytics().log('App mounted.');
  }, []);

  return (
    <ContextProvider>
      {animating ? <SplashScreen /> : <StackNav />}
    </ContextProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
