import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import {settings} from '../../config';
import {Icon, Fab} from 'native-base';
import {AppRouter} from '../../navigation/AppRouter';
import {Header} from '../../components/header';
import {RenderItem} from './renderItem';
import {useNavigation} from '@react-navigation/native';

import {getMH} from '../../../server/MonHoc/getMH';
import {createMH} from '../../../server/MonHoc/createMH';
import {deleteMH} from '../../../server/MonHoc/deleteMH';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateMH} from '../../../server/MonHoc/updateMH';
import {getLop} from '../../../server/Lop/getLop/index.js';
import {createLop} from '../../../server/Lop/createLop/index.js';
import {updateLop} from '../../../server/Lop/updateLop/index.js';
import {deleteLop} from '../../../server/Lop/deleteLop';

export const ListClass = () => {
  const nav = useNavigation();
  const [data, setData] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [resPOST, setResPOST] = useState('');
  const [showModal, setModal] = useState(false);

  const [tenMH, setTenMH] = useState('');
  const [tinChi, setTinChi] = useState('');
  const [tiet, setTiet] = useState('');
  const [user, setUser] = useState('');

  const [flag, setFlag] = useState(0);
  const [currentObject, setCurrentObject] = useState('');

  // Kéo xuống để reload
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    wait(500).then(() => setRefreshing(false));
  }, []);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  // Lấy thông tin tài khoản đang đăng nhập vs danh sách môn học
  // Bất đồng bộ ---
  useEffect(() => {
    getAccount();
    getData();
  }, []);

  // Khi thêm thành công thì sẽ refesh lại
  useEffect(() => {
    if (resPOST !== '') {
      onRefresh();
    }
  }, [resPOST]);

  // Khi lấy data xong thì không load nữa
  useEffect(() => {
    if (data !== '') {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (flag == 1 && showModal === false) {
      setFlag(0);
      setTenMH('');
      setTinChi('');
      setLoading(false);
    }
  }, [showModal]);

  // Lấy thông tin tài khoản đang đăng nhập
  const getAccount = async () => {
    try {
      const res = await AsyncStorage.getItem('currentUser');
      setUser(JSON.parse(res));
    } catch (e) {
      // error reading value
    }
  };

  // Lấy danh sách môn học
  const getData = async () => {
    try {
      const res = await getLop();
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Tạo môn học mới
  const postData = async () => {
    try {
      const res = await createLop(tenMH, tinChi);
      setTenMH('');
      setTinChi('');
      setResPOST(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Sua môn học
  const postDataEdit = async () => {
    try {
      const res = await updateLop(currentObject, tenMH, tinChi);
      setFlag(0);
      setTenMH('');
      setTinChi('');
      setResPOST(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Xóa môn học
  const postDel = async data => {
    try {
      const res = await deleteLop(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Nhấn vô item
  const handlePressItem = item => {
    console.log(item);

    if (user[0]?.isAdmin !== undefined && parseInt(user[0]?.isAdmin) === 1) {
      setFlag(1);

      setCurrentObject(item.MaLop);
      setTenMH(item.TenLop);
      setTinChi(item.SoLuongSV);

      setModal(true);
    }
  };

  // Nhấn nút thêm môn học
  const createMonHoc = () => {
    setModal(false);
    flag === 0 ? postData() : postDataEdit();
  };

  // Nhấn nút xóa môn học
  const del = item => {
    postDel(item?.MaLop);
    onRefresh();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header user={user} />

      {!loading ? (
        <>
          {data !== '' ? (
            <View style={{backgroundColor: '#fff', flex: 1}}>
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
                      DANH SÁCH LỚP HỌC
                    </Text>
                  </View>
                }
                data={data}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <RenderItem
                    item={item}
                    data={data}
                    handle={handlePressItem}
                    del={del}
                    user={user}
                  />
                )}
                keyExtractor={item => item.MaMH}
                style={{flex: 1, paddingTop: 10, backgroundColor: '#fff'}}
              />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#fff',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 14, color: 'red'}}>Không có data</Text>
            </View>
          )}

          {user[0]?.isAdmin !== undefined && parseInt(user[0]?.isAdmin) === 1 && (
            <Fab
              containerStyle={{}}
              style={{backgroundColor: settings.colors.colorMain}}
              position="bottomRight"
              onPress={() => {
                setModal(true);
              }}>
              <Icon name="plus" type="AntDesign" />
            </Fab>
          )}
        </>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../asset/gif/load321.gif')}
            resizeMode="contain"
            style={{width: 100, height: 100}}
          />
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setModal(false);
        }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor="rgba(0,0,0,1)"
          hidden={false}
          animated={true}
        />
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <Text
            onPress={() => {
              setModal(false);
            }}
            style={{flex: 1}}
          />
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                setModal(false);
              }}
              style={{flex: 1}}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                height: 285,
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  width: '100%',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    color: settings.colors.colorGreen,
                    fontSize: 16,
                    fontWeight: 'bold',
                    flex: 1,
                  }}>
                  {flag === 0 ? 'THÊM' : 'SỬA'} LỚP HỌC
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                  }}
                  style={{
                    height: '100%',
                    paddingLeft: 20,
                  }}>
                  <Icon
                    type="AntDesign"
                    name="close"
                    style={{
                      fontSize: 24,
                      color: settings.colors.colorGreen,
                      marginBottom: -2,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Tên lớp học
              </Text>
              <View
                style={{
                  height: 50,
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  borderRadius: 12,
                }}>
                <TextInput
                  placeholder="Tên lớp học"
                  placeholderTextColor="#B0BEC5"
                  value={tenMH}
                  onChangeText={t => {
                    setTenMH(t);
                  }}
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 2,
                    color: '#000',
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Số sinh viên
              </Text>
              <View
                style={{
                  height: 50,
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  borderRadius: 12,
                }}>
                <TextInput
                  placeholder="Số sinh viên"
                  placeholderTextColor="#B0BEC5"
                  value={tinChi}
                  keyboardType="number-pad"
                  onChangeText={t => {
                    setTinChi(t);
                  }}
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 2,
                    color: '#000',
                  }}
                />
              </View>

              <View style={{height: 10}} />

              <TouchableOpacity
                onPress={() => {
                  createMonHoc();
                }}
                activeOpacity={0.5}
                style={{
                  height: 50,
                  backgroundColor: settings.colors.colorGreen,
                  marginHorizontal: 10,
                  marginVertical: 10,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#ffF', fontSize: 14, fontWeight: 'bold'}}>
                  {flag === 0 ? 'THÊM LỚP HỌC' : 'LƯU LẠI'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              onPress={() => {
                setModal(false);
              }}
              style={{flex: 1}}
            />
          </View>
          <Text
            onPress={() => {
              setModal(false);
            }}
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </View>
  );
};
