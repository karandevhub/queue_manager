import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import axios from 'axios';

const AdminCalender = props => {
  const {businessId, businessName} = props.route.params;
  const [selectDate, setSelectDate] = useState(new Date());
  const [queueDetails, setQueueDetaiils] = useState(null);

  const getQueueByDate = async selectDate => {
    try {
      const url = `https://token-app-backend.vercel.app/api/v1/admin/queueByDate?businessId=${businessId}&queryDate=${selectDate}`;
      const response = await axios.get(url);
      const queueData = response?.data;
      setQueueDetaiils(queueData?.queueDetails?.usersList);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message === 'Queue not found')
        setQueueDetaiils([]);
    }
  };

  useEffect(() => {
    getQueueByDate(selectDate);
  }, []);

  return (
    <>
      <CalendarStrip
        style={{height: 100, paddingTop: 10, paddingBottom: 10}}
        calendarColor={'#3498db'}
        calendarHeaderStyle={{color: '#fff'}}
        dateNumberStyle={{color: '#fff'}}
        dateNameStyle={{color: '#000'}}
        highlightDateNumberStyle={{color: '#000'}}
        highlightDateNameStyle={{color: '#000'}}
        onDateSelected={date => {
          setSelectDate(date);
          getQueueByDate(date);
        }}
      />
      <FlatList
        style={{width: '100%', marginTop: 10}}
        data={queueDetails}
        keyExtractor={item => item?._id}
        renderItem={({item}) => (
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
              <Text style={{fontSize: 20, color: 'black'}}>{item.name}</Text>
              <Text style={{fontSize: 15, color: 'black'}}>{item.phone}</Text>
            </View>
          </View>
        )}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
});

export default AdminCalender;
