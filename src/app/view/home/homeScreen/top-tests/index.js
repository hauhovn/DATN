import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
//moduns
import AsyncStorage from '@react-native-async-storage/async-storage';
//colors
import {settings} from '../../../../config';
//screen
import {ItemTest} from './item';
//APIs
import {getTests} from '../../../../../server/BaiKiemTra';

export default TopTests = () => {
  const [data, setdata] = useState(undefined);
  const [user, setUser] = useState('');

  useEffect(() => {
    console.log('get acc');
    getAccount();
  }, []);

  useEffect(() => {
    if (user != '') getdata();
  }, [user]);

  const getdata = async () => {
    try {
      console.log('get test 2');
      const res = await getTests(user[0]?.MaSV, 2);
      console.log('Top tests :', res);
      setdata(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getAccount = async () => {
    try {
      const res = await AsyncStorage.getItem('currentUser');
      setUser(JSON.parse(res));
    } catch (e) {
      // error reading value
    }
  };
  const pressItem = item => {
    console.log('pressItem : ', item);
  };
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 240,
        flexDirection: 'column',
      }}>
      <Text
        style={{
          fontSize: 14,
          color: settings.colors.colorMain,
          marginVertical: 5,
          marginLeft: 10,
        }}>
        BÀI KIỂM TRA SẮP TỚI
      </Text>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <ItemTest item={item} data={data} handle={pressItem} />
        )}
        keyExtractor={item => item.MaBaiKT}
      />
      <ItemTest />
    </View>
  );
};
