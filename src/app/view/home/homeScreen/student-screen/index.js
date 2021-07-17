import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
//MODUNs
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
//STYLEs
const mainColor = '#FF7043';
//CONTAINTs
import {KEYS_VALUE} from './key_value';
//Item
import {ItemTest} from './item-test';
//APIs
import {getCTBaiKiemTra} from '../../../../../server/BaiKiemTra/getTestDetail';
//
import {getBaiKiemTra} from '../../../../../server/BaiKiemTra';
import {AppRouter} from '../../../../navigation/AppRouter';
import {settings} from '../../../../config';

import {TestDetailModal} from '../../homeScreen/student-screen/StudentSubView/modals/TestDetailModal';

export const StudentScreen = () => {
  const nav = useNavigation();
  const [user, setUser] = useState('');
  const [listTest, setListTest] = useState('');
  const [clickedItem, setClickedItem] = useState('');
  const [sentData, setSentData] = useState({
    MaSV: '',
    MaBaiKT: '',
  });
  const [isShowDialog, setIsShowDialog] = useState(false);

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (user !== '') {
      console.log('Sinh Vien: ', user);
      getTests();
    }
  }, [user]);

  //funcs
  const getAccount = async () => {
    try {
      console.log('Sinh Vien: ', user);
      const res = await AsyncStorage.getItem('currentUser');
      setUser(JSON.parse(res));
    } catch (e) {
      // error reading value
    }
  };

  const getTests = async () => {
    let data = await getBaiKiemTra(user[0]?.MaSV, 3);
    setListTest(data);
    console.log(listTest);
  };

  const HeaderHandle = value => {
    console.log(value);
    if (value === KEYS_VALUE.SAP_DIEN_RA)
      nav.navigate(AppRouter.STUDENT_LIST_TEST, {MaSV: user[0]?.MaSV});
    if (value === KEYS_VALUE.BAI_KIEM_TRA)
      nav.navigate(AppRouter.TESTING, {SinhVien: user[0]});
    if (value === KEYS_VALUE.LOP_HOC_PHAN)
      nav.navigate(AppRouter.LOP_HOC_PHAN, {SinhVien: user[0]});
  };
  // Nhấn vô item
  const handlePressItem = item => {
    sentData.MaBaiKT = item.MaBaiKT;
    sentData.MaSV = user[0].MaSV;

    setSentData(sentData);
    setIsShowDialog(true);
  };

  const pressHandleKey = () => {
    /* 1. Navigate to the Details route with params */
    nav.navigate(AppRouter.TESTING, {
      itemId: 86,
      otherParam: 'anything you want here',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../../../../asset/images/bg-header.jpg')}>
        <View style={header.title}>
          <Text style={[header.subTitle, {fontWeight: 'bold', fontSize: 10}]}>
            Sinh viên
          </Text>
          <Text style={[header.subTitle, {marginTop: 2, fontSize: 14}]}>
            {user[0]?.TenSV}
          </Text>
        </View>
        <View style={header.listItems}>
          <TouchableOpacity
            style={items.container}
            onPress={() => HeaderHandle(KEYS_VALUE.LOP_HOC_PHAN)}>
            <View style={items.button}>
              <Icon
                type="MaterialCommunityIcons"
                name="google-classroom"
                style={{
                  fontSize: 20,
                  color: mainColor,
                }}
              />
            </View>
            <Text style={items.textTitle}>Lớp học phần</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              HeaderHandle(KEYS_VALUE.BAI_KIEM_TRA);
            }}
            activeOpacity={0.5}
            style={items.container}>
            <View style={items.button}>
              <Icon
                type="FontAwesome"
                name="file-text-o"
                style={{
                  fontSize: 18,
                  color: mainColor,
                }}
              />
            </View>
            <Text style={items.textTitle}>Bài kiểm tra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              HeaderHandle(KEYS_VALUE.SAP_DIEN_RA);
            }}
            activeOpacity={0.5}
            style={items.container}>
            <View style={items.button}>
              <Icon
                type="Ionicons"
                name="stopwatch-outline"
                style={{
                  fontSize: 26,
                  color: mainColor,
                }}
              />
            </View>
            <Text style={items.textTitle}>Sắp diễn ra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              HeaderHandle(KEYS_VALUE.DA_KET_THUC);
            }}
            activeOpacity={0.5}
            style={items.container}>
            <View style={items.button}>
              <Icon
                type="Ionicons"
                name="checkmark-done-circle-outline"
                style={{
                  fontSize: 24,
                  color: mainColor,
                }}
              />
            </View>
            <Text style={items.textTitle}>Đã kết thúc</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.body}>
        <Text
          style={{
            fontSize: 14,
            color: settings.colors.colorGreen,
            marginVertical: 5,
            marginLeft: 10,
            paddingTop: 20,
            fontWeight: 'bold',
          }}>
          BÀI KIỂM TRA SẮP TỚI
        </Text>
        <View style={styles.listTest}>
          {listTest != '' ? (
            <FlatList
              data={listTest}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <ItemTest
                  item={item}
                  data={listTest}
                  handle={handlePressItem}
                />
              )}
              keyExtractor={item => item.MaBaiKT}
            />
          ) : (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: settings.colors.colorMain,
                }}>
                Chưa có bài kiểm tra
              </Text>
            </View>
          )}
        </View>
        <TestDetailModal
          modalVisible={isShowDialog}
          close={() => {
            setIsShowDialog(false);
          }}
          data={sentData}
          pressHandle={() => {
            pressHandleKey();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageBackground: {
    flex: 2.5,
    resizeMode: 'contain',
  },
  body: {
    flex: 7.5,
  },
  listTest: {
    flex: 1,
  },
});
const header = StyleSheet.create({
  title: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  subTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItems: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const items = StyleSheet.create({
  container: {
    height: '100%',
    width: '25%',
    alignItems: 'center',
  },
  button: {
    height: 40,
    width: 40,
    margin: 10,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#CFD8DC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textTitle: {
    marginTop: -5,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
