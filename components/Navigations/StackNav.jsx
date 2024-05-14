import {StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppContext} from '../context/Context';
import UserAuthStack from './UserAuthStack';
import UserStack from './UserStack';

const StackNav = () => {
  const {userid} = useContext(AppContext);

  return (
    <NavigationContainer>
      {userid === null ? <UserAuthStack /> : <UserStack />}
    </NavigationContainer>
  );
};

export default StackNav;

const styles = StyleSheet.create({});
