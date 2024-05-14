import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UserDetails from '../screens/UserDetails';

const UserStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default UserStack;

const styles = StyleSheet.create({});
