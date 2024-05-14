import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

import Icon from 'react-native-vector-icons/EvilIcons';

const QueueDetails = props => {
  const {queueId, queueName} = props.route.params;
  // console.log(queueId)

  const [queueDetails, setQueueDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getQueueDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://token-app-backend.vercel.app/api/v1/admin/fetchQueue?queueId=${queueId}`,
      );
      const data = response.data?.queue;
      // console.log(data)
      setQueueDetails(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQueueDetails();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getQueueDetails();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    ToastAndroid.show('Queue updated', ToastAndroid.SHORT);
  }, []);

  const onDone = async userId => {
    try {
      const response = await axios.patch(
        `https://token-app-backend.vercel.app/api/v1/admin/removeUserFromQueue?userId=${userId}`,
      );
      console.log(response.data, 'ondone this is response');
    } catch (err) {
      console.log(err);
    } finally {
      onRefresh();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        padding: 10,
      }}>
      <Text style={{color: 'black', fontSize: 25}}>{queueName}</Text>
      <FlatList
        style={{width: '100%'}}
        data={queueDetails?.usersList}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <>
            {item?.isDone === false && (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 3,
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'start',
                    alignItems: 'start',
                  }}>
                  <Text style={{fontSize: 20, color: 'black'}}>
                    {item.name}
                  </Text>
                  <Text style={{fontSize: 15, color: 'black'}}>
                    {item.phone}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onDone(item?._id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'green',
                      padding: 10,
                      borderRadius: 10,
                      marginVertical: 3,
                      width: '100%',
                      flexDirection: 'row',
                    }}>
                    <Icon name="check" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
            <Text style={{color: 'black', fontSize: 20}}>
              No users in the queue
            </Text>
          </View>
        }
        ListFooterComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
            <Text style={{color: 'black', fontSize: 20}}>
              This is the end of the queue
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default QueueDetails;
