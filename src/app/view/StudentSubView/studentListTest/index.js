import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
//modun
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Icon} from 'native-base';
//item
import {ItemTest} from '../../home/homeScreen/student-screen/item-test';
//api
import {getBaiKiemTra} from '../../../../server/BaiKiemTra';
//settting
import {settings} from '../../../config';
//screens
import {TestDetail} from '../testDetail';

export const StudentTestList = ({navigation, route}) => {
  const nav = useNavigation();
  const fo = useIsFocused();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [data, setData] = useState('');
  const [clickedData, setClickedData] = useState({
    MaBaiKT: '',
    Ngay: '',
    TenBaiKT: '',
    TenLopHP: '',
    ThoiGianLam: '',
    MaSV: '',
    TenGV: '',
  });
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
  const handlePressItem = async item => {
    clickedData.MaBaiKT = item.MaBaiKT;
    clickedData.Ngay = item.Ngay;
    clickedData.TenBaiKT = item.TenBaiKT;
    clickedData.TenLopHP = item.TenLopHP;
    clickedData.ThoiGianLam = item.ThoiGianLam;
    clickedData.MaSV = SinhVien.MaSV;

    //let res = await getCTBaiKiemTra(SinhVien.MaSV, item.MaBaiKT);
    //clickedData.TenGV = res.TenGV;

    setClickedData({clickedData});
    console.log('clicked: ', clickedData);

    setIsShowDialog(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon
            type="MaterialIcons"
            name="keyboard-arrow-left"
            style={{color: '#fff', fontSize: 32, marginLeft: 2}}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 18, color: '#fff'}}>
          DANH SÁCH BÀI KIỂM TRA
        </Text>
        <Text></Text>
      </View>
      <View style={styles.filter}>
        <Text>filler</Text>
      </View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <ItemTest item={item} data={data} handle={handlePressItem} />
        )}
        keyExtractor={item => item.MaBaiKT}
        style={{flex: 1, marginTop: 12, backgroundColor: '#fff'}}
      />
      {isShowDialog ? (
        <TestDetail
          modalVisible={isShowDialog}
          closeDialog={() => setIsShowDialog(false)}
          data={clickedData}
        />
      ) : (
        <View></View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: settings.colors.colorMain,
    height: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filter: {},
});
