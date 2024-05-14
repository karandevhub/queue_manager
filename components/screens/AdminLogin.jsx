import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';

import axios from 'axios';
import {getUniqueId} from 'react-native-device-info';

const AdminLogin = ({navigation}) => {
  const [businessName, setBusinessName] = useState('');
  const [businessDes, setBusinessDes] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [phone, setPhone] = useState('');

  getUniqueId().then(id => {
    setDeviceId(id);
  });

  const showToast = () => {
    ToastAndroid.show('Business Created Successfully', ToastAndroid.SHORT);
  };

  const handleNewAccount = async () => {
    try {
      if (businessDes === '' || businessName === '' || phone === '') {
        alert('Please fill all the fields');
        return;
      }
      let data = {
        name: businessName,
        phone: phone,
        description: businessDes,
        deviceId: deviceId,
      };
      console.log(data);
      const url = `https://token-app-backend.vercel.app/api/v1/admin/createBusiness`;
      const response = await axios.post(url, data);
      showToast();
      navigation.navigate('AdminDetails', {
        businessId: response?.data?.newBusiness?._id,
      });
      console.log(response);
    } catch (error) {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Business</Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            color: 'indigo',
          }}>
          Business Name
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'column',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            color: 'indigo',
          }}>
          Business Description
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Business Description"
          value={businessDes}
          onChangeText={setBusinessDes}
        />
      </View>

      <View
        style={{
          width: '100%',
          flexDirection: 'column',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            color: 'indigo',
          }}>
          Phone Number
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNewAccount}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'indigo',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
    color: '#333',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  socialButton: {
    paddingVertical: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  socialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminLogin;
