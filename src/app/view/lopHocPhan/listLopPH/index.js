import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import {settings} from '../../../config';
import {Icon, Fab, Picker, Item} from 'native-base';
import {AppRouter} from '../../../navigation/AppRouter';
import {Header} from '../../../components/header';
import {RenderItem} from './renderItem';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {getLPH} from '../../../../server/LopHP/getLHP';
import {createLPH} from '../../../../server/LopHP/createLHP';
import {deleteCD} from '../../../../server/ChuDe/deleteCD';
import {getMH} from '../../../../server/MonHoc/getMH';
import {getLop} from '../../../../server/Lop/getLop/index.js';
import {getGiangVien} from '../../../../server/User/getGiangVien';
import Toast from 'react-native-simple-toast';

const {width: dW, height: dH} = Dimensions.get('window');

export const ListLopHP = () => {
  const nav = useNavigation();
  const [data, setData] = useState('');
  const [listMonHoc, setListMonHoc] = useState('');
  const [listLopHoc, setListLopHoc] = useState('');
  const [loading, setLoading] = useState(true);
  const [resPOST, setResPOST] = useState('');
  const [showModal, setModal] = useState(false);
  const [tenCD, setTenCD] = useState('');
  const [monHoc, setMonHoc] = useState('');
  const [teachers, setTeachers] = useState('');
  const [lopHoc, setLopHoc] = useState('');
  const [teach, setTeach] = useState('');
  const [user, setUser] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState(0);

  // Lấy thông tin tài khoản đang đăng nhập vs danh sách môn học
  // Bất đồng bộ ---
  useEffect(() => {
    Toast.show('Chọn 1 lớp học phần', Toast.SHORT);
    getAccount();
  }, []);

  useEffect(() => {
    if (user !== '') {
      console.log('user: ', user);
      getMonHoc();
      getData();
      getLopHoc();
      getTeachers();
    }
  }, [user]);

  // Khi thêm thành công thì sẽ refesh lại
  useEffect(() => {
    if (resPOST !== '') {
      getData();
    }
  }, [resPOST]);

  // Khi lấy data xong thì không load nữa
  useEffect(() => {
    if (data !== '') {
      setLoading(false);
    }
  }, [data]);

  // Khi filter thi chay
  useEffect(() => {
    getData(filter);
  }, [filter]);

  // Lấy thông tin tài khoản đang đăng nhập
  const getAccount = async () => {
    try {
      const res = await AsyncStorage.getItem('currentUser');
      setUser(JSON.parse(res));
    } catch (e) {
      // error reading value
    }
  };

  // Lấy danh sách chủ đề
  const getData = async () => {
    try {
      const res = await getLPH(user[0]?.MaGV, filter);
      console.log('res: ', res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy danh sách giang vien
  const getTeachers = async () => {
    try {
      const res = await getGiangVien();
      await setTeachers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy danh sách môn học
  const getMonHoc = async () => {
    try {
      const res = await getMH();
      setListMonHoc(res.data);
      console.log('Mon hoc: ', listMonHoc);
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy danh sách lớp học
  const getLopHoc = async () => {
    try {
      const res = await getLop();
      setListLopHoc(res.data);
      console.log('Lop hoc: ', listLopHoc);
    } catch (error) {
      console.log(error);
    }
  };

  // Tạo lớp học phần
  const postData = async () => {
    try {
      const res = await createLPH(tenCD, teach, monHoc, lopHoc);
      setResPOST(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa chủ đề
  const postDel = async data => {
    try {
      const res = await deleteCD(data);
      console.log('res: ', res);
    } catch (error) {
      console.log(error);
    }
  };

  // Nhấn vô item
  const handlePressItem = item => {
    console.log('handlePressItem: ', item);
    nav.navigate(AppRouter.QUESTION, {
      item: item,
      user: user,
    });
  };

  // Nhấn nút thêm môn học
  const createChuDe = () => {
    if (tenCD.trim() === '' || tenCD === '') {
      Alert.alert('Không thành công', 'Vui lòng nhập tên chủ đề');
    } else {
      if (teach === '' || tenCD === 'Chọn giảng viên') {
        Alert.alert('Không thành công', 'Vui lòng chọn giảng viên');
      } else {
        if (monHoc === '' || monHoc === 'Chọn môn học') {
          Alert.alert('Không thành công', 'Vui lòng chọn môn học');
        } else {
          if (lopHoc === '' || lopHoc === 'Chọn lớp') {
            Alert.alert('Không thành công', 'Vui lòng chọn lớp');
          } else {
            setModal(false);
            postData();

            setMonHoc('Chọn môn học');
            setTenCD('');
          }
        }
      }
    }
  };

  // Nhấn nút xóa môn học
  const del = item => {
    postDel(item?.MaCD);
    getData();
  };

  // Nhấn nút
  const handlePressButton = item => {
    console.log(item);
    nav.navigate(AppRouter.SINHVIEN, {
      LopHP: item,
      user: user,
    });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: settings.colors.colorMain}}>
      <StatusBar barStyle="dark-content" hidden={true} />
      <Header user={user} />

      {!loading ? (
        <>
          <View style={{backgroundColor: '#fff', flex: 1}}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
              <Text
                style={{
                  flex: 1,
                  marginLeft: '3%',
                  color: settings.colors.colorThumblr,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  fontSize: 16,
                  marginTop: 10,
                }}>
                DANH SÁCH LỚP HỌC PHẦN
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowFilter(!showFilter);
                }}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 10,
                  borderRadius: 500,
                  backgroundColor: settings.colors.colorMain,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  type="FontAwesome"
                  name="filter"
                  style={{fontSize: 18, color: '#fff', marginTop: 2}}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 10,
                  marginLeft: -50,
                }}>
                {listMonHoc !== '' && (
                  <Picker
                    selectedValue={0}
                    mode="dialog"
                    textStyle={{opacity: 0}}
                    style={{height: 45, width: 50, opacity: 0}}
                    onValueChange={(itemValue, itemIndex) => {
                      console.log(itemValue);
                      setFilter(itemValue);
                    }}>
                    <Picker.Item label="Tất cả" value={'0'} />
                    {listMonHoc?.map(i => (
                      <Picker.Item label={i.TenMonHoc} value={i.MaMH} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>

            <FlatList
              data={data}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <RenderItem
                  item={item}
                  data={data}
                  handle={handlePressItem}
                  del={del}
                  user={user}
                  handlePressButton={handlePressButton}
                />
              )}
              keyExtractor={item => item.MaLopHP}
              style={{
                flex: 1,
                backgroundColor: '#fff',
                marginTop: -5,
              }}
              ListFooterComponent={
                <View style={{width: '100%', height: 100}} />
              }
            />
          </View>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('../../../asset/gif/load321.gif')}
            resizeMode="contain"
            style={{width: 100, height: 100}}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
