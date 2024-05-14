import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../../config';
import QRCode from 'react-native-qrcode-svg';

const GenerateToken = () => {
  const [generatedQRdata, setGeneratedQRdata] = useState();
  const [queueName, setQueueName] = useState('');
  const [queueDescription, setQueueDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerateToken = async () => {
    try {
      const body = {
        queueName: queueName,
        queueDes: queueDescription,
      };
      const token = await axios.post(`${BASE_URL}/queue/generateQueue`, body);
      const fomatedData = {
        id: token.data.queue._id,
        queueName: token.data.queue.queueName,
        usersList: token.data.queue.queueName,
        queueDes: token.data.queue.queueDes,
      };
      const stringData = JSON.stringify(fomatedData);
      console.log('formatted data', stringData);
      setGeneratedQRdata(stringData);
      setModalVisible(false);
      setQueueName('');
      setQueueDescription('');
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {generatedQRdata && (
          <View style={{marginBottom: 50}}>
            <Text
              style={{
                color: 'gray',
                fontSize: 20,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Generated QR
            </Text>
            <View style={{borderColor: 'black', borderWidth: 1, padding: 5}}>
              <QRCode
                value={generatedQRdata}
                color={'white'}
                backgroundColor="black"
                size={200}
              />
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Generate Token</Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalCenter}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Queue Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Queue Name"
                  value={queueName}
                  onChangeText={text => setQueueName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Queue Description"
                  value={queueDescription}
                  onChangeText={text => setQueueDescription(text)}
                  multiline={true}
                  numberOfLines={5}
                />
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={[styles.button, {backgroundColor: '#27ae60'}]}
                    onPress={handleGenerateToken}>
                    <Text style={styles.buttonText}>Generate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, {backgroundColor: '#e74c3c'}]}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
});

export default GenerateToken;
