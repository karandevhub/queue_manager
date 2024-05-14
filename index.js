/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';

import {name as appName} from './app.json';

import crashlytics from '@react-native-firebase/crashlytics';
crashlytics().setCrashlyticsCollectionEnabled(true)

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


AppRegistry.registerComponent(appName, () => App);
