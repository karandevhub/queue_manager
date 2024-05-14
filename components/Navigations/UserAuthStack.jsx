import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRscreen from '../screens/QRscreen';
import QueueForm from '../screens/QueueForm';
import GenerateToken from '../screens/GenerateToken';
import AdminDetails from '../screens/AdminDetails';
import AdminLogin from '../screens/AdminLogin';
import AdminCalender from '../screens/AdminCalendar';
import QueueDetails from '../screens/QueueDetails';

const UserAuthStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="QRscreen"
        component={QRscreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="QueueForm"
        component={QueueForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GenerateToken"
        component={GenerateToken}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdminDetails"
        component={AdminDetails}
        options={({route}) => ({
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitle: `${route?.params?.businessName} Home`,
        })}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdminCalendar"
        component={AdminCalender}
        options={({route}) => ({
          headerShown: true,
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitle: `${route?.params?.businessName} Calendar`,
        })}
      />
      <Stack.Screen
        name="QueueDetails"
        component={QueueDetails}
        options={({route}) => ({
          headerShown: true,
          animation: 'slide_from_left',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitle: `${route.params.queueName} Details`,
        })}
      />
    </Stack.Navigator>
  );
};

export default UserAuthStack;

const styles = StyleSheet.create({});
