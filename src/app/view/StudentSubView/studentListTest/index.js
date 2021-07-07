import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, Text, FlatList} from 'react-native';
//modun
import {useNavigation, useIsFocused} from '@react-navigation/native';
//item
import {ItemTest} from '../../home/homeScreen/student-screen/item-test';
//api
import {getBaiKiemTra} from '../../../../server/BaiKiemTra';
//settting
import {settings} from '../../../config';

export const StudentTestList = ({route}) => {
  const nav = useNavigation();
  const fo = useIsFocused();
  const [data, setData] = useState('');
  const SinhVien = route.params;

  useEffect(() => {
    //getAccount();
  }, []);

  useEffect(() => {
    if (fo) {
      try {
        console.log('MaSV: ', SinhVien.MaSV);
        getTests();
      } catch (error) {}
    }
  }, [fo]);

  const getTests = async () => {
    let res = await getBaiKiemTra(SinhVien.MaSV);
    setData(res);
    console.log(data);
  };

  // Nhấn vô item
  const handlePressItem = item => {
    console.log(item);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <View>
            <Text
              style={{
                marginLeft: '3%',
                color: settings.colors.colorThumblr,
                fontWeight: 'bold',
                marginBottom: 5,
                fontSize: 16,
              }}>
              DANH SÁCH BÀI KIỂM TRA
            </Text>
          </View>
        }
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ItemTest item={item} data={data} handle={handlePressItem} />
        )}
        keyExtractor={item => item.MaBaiKT}
        style={{flex: 1, paddingTop: 10, backgroundColor: '#fff'}}
      />
    </SafeAreaView>
  );
};
