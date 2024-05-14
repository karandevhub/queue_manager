import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Queue Manager</Text>
      <Text style={styles.title}>Queue Management System</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
});

export default SplashScreen;
