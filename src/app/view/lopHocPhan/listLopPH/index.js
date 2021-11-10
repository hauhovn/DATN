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
import {updateLPH} from '../../../../server/LopHP/updateLPH';
import {deleteLPH} from '../../../../server/LopHP/deleteLHP';
import {doneLPH} from '../../../../server/LopHP/doneLHP';

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
      setData(res.data);
    } catch (error) {
      //
    }
  };

  // Lấy danh sách giang vien
  const getTeachers = async () => {
    try {
      const res = await getGiangVien();
      await setTeachers(res.data);
    } catch (error) {
      //
    }
  };

  // Lấy danh sách môn học
  const getMonHoc = async () => {
    try {
      const res = await getMH();
      setListMonHoc(res.data);
    } catch (error) {
      //
    }
  };

  // Lấy danh sách lớp học
  const getLopHoc = async () => {
    try {
      const res = await getLop();
      setListLopHoc(res.data);
    } catch (error) {
      //
    }
  };

  // Tạo lớp học phần
  const postData = async () => {
    try {
      const res = await createLPH(tenCD, teach, monHoc, lopHoc);
      setResPOST(res);
      getData();
    } catch (error) {
      //
    }
  };

  // Xóa chủ đề
  const postDel = async data => {
    try {
      const res = await deleteLPH(data.MaLopHP);
      initData();
      getData();
    } catch (error) {
      //
    }
  };

  // xong chủ đề
  const postDone = async data => {
    try {
      const res = await doneLPH(data.MaLopHP);
      initData();
      getData();
    } catch (error) {
      //
    }
  };

  const [editID, setEditID] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const postEdit = async () => {
    try {
      const res = await updateLPH(editID, tenCD, teach, monHoc, lopHoc);
      initData();
      getData();
    } catch (error) {
      //
    }
  };

  const onEdit = data => {
    setEditID(data.MaLopHP);
    setIsEdit(true);
    setTenCD(data.TenLopHP);
    setMonHoc(data.MaMH);
    setTeach(data.MaGV);
    setLopHoc(data.MaLop);
    setModal(true);
  };

  // Nhấn vô item
  const handlePressItem = item => {
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

  const initData = () => {
    setTenCD('');
    setMonHoc('');
    setTeach('');
    setLopHoc('');
  };

  // Nhấn nút xóa môn học
  const del = item => {
    postDel(item);
  };

  const dol = item => {
    postDone(item);
  };

  // Nhấn nút
  const handlePressButton = item => {
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
                      setFilter(itemValue);
                    }}>
                    <Picker.Item label="Tất cả" value={'0'} />
                    {listMonHoc?.map(i => (
                      /** Map nho quang cai KEY vo */
                      <Picker.Item
                        key={i.MaMH}
                        label={i.TenMonHoc}
                        value={i.MaMH}
                      />
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
                  onDelete={del}
                  onDone={dol}
                  onEdit={onEdit}
                  user={user}
                  handlePressButton={handlePressButton}
                />
              )}
              keyExtractor={(item, index) => `${item.MaLopHP}_${index}`}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setModal(false);
          initData();
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
              initData();
            }}
            style={{flex: 1}}
          />
          <View
            style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Text
              onPress={() => {
                setModal(false);
                initData();
              }}
              style={{flex: 1}}
            />
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                height: 436,
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
                  THÊM LỚP HỌC PHẦN
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                    initData();
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
                Tên lớp học phần
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
                  placeholder="Tên lớp học phần"
                  placeholderTextColor="#8a817c"
                  value={tenCD}
                  onChangeText={t => {
                    setTenCD(t);
                  }}
                  style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 2,
                    color: '#000',
                    fontSize: 16,
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Chọn môn học
              </Text>

              <View
                style={{
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  height: 45,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 15,
                }}>
                {listMonHoc !== '' && (
                  <Picker
                    selectedValue={monHoc}
                    mode="dialog"
                    style={{height: 45, width: dW - 65, marginLeft: -15}}
                    onValueChange={(itemValue, itemIndex) => {
                      setMonHoc(itemValue);
                    }}>
                    <Picker.Item label="Chọn môn học" value="Chọn môn học" />
                    {listMonHoc?.map(i => (
                      <Picker.Item label={i.TenMonHoc} value={i.MaMH} />
                    ))}
                  </Picker>
                )}
              </View>

              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Chọn lớp
              </Text>

              <View
                style={{
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  height: 45,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 15,
                }}>
                {listLopHoc !== '' && (
                  <Picker
                    selectedValue={lopHoc}
                    mode="dialog"
                    style={{height: 45, width: dW - 65, marginLeft: -15}}
                    onValueChange={(itemValue, itemIndex) => {
                      setLopHoc(itemValue);
                    }}>
                    <Picker.Item label="Chọn lớp" value="Chọn lớp" />
                    {listLopHoc?.map(i => (
                      <Picker.Item label={i.TenLop} value={i.MaLop} />
                    ))}
                  </Picker>
                )}
              </View>

              <Text
                style={{
                  marginTop: 10,
                  color: settings.colors.colorGreen,
                  marginLeft: 10,
                }}>
                Chọn giảng viên
              </Text>

              <View
                style={{
                  marginTop: 5,
                  marginHorizontal: 10,
                  borderWidth: 1,
                  borderColor: settings.colors.colorBoderDark,
                  height: 45,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 15,
                }}>
                {teachers !== '' && (
                  <Picker
                    selectedValue={teach}
                    mode="dialog"
                    style={{height: 45, width: dW - 65, marginLeft: -15}}
                    onValueChange={(itemValue, itemIndex) => {
                      setTeach(itemValue);
                    }}>
                    <Picker.Item
                      label="Chọn giảng viên"
                      value="Chọn giảng viên"
                    />
                    {teachers?.map(i => (
                      <Picker.Item label={i.TenGV} value={i.MaGV} />
                    ))}
                  </Picker>
                )}
              </View>

              <View style={{height: 10}} />

              {!isEdit ? (
                <TouchableOpacity
                  onPress={() => {
                    createChuDe();
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
                  <Text
                    style={{color: '#ffF', fontSize: 14, fontWeight: 'bold'}}>
                    THÊM LỚP HỌC PHẦN
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (tenCD.trim() === '' || tenCD === '') {
                      Alert.alert(
                        'Không thành công',
                        'Vui lòng nhập tên chủ đề',
                      );
                    } else {
                      if (teach === '' || tenCD === 'Chọn giảng viên') {
                        Alert.alert(
                          'Không thành công',
                          'Vui lòng chọn giảng viên',
                        );
                      } else {
                        if (monHoc === '' || monHoc === 'Chọn môn học') {
                          Alert.alert(
                            'Không thành công',
                            'Vui lòng chọn môn học',
                          );
                        } else {
                          if (lopHoc === '' || lopHoc === 'Chọn lớp') {
                            Alert.alert(
                              'Không thành công',
                              'Vui lòng chọn lớp',
                            );
                          } else {
                            setModal(false);
                            postEdit();
                          }
                        }
                      }
                    }
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
                  <Text
                    style={{color: '#ffF', fontSize: 14, fontWeight: 'bold'}}>
                    CẬP NHẬT THÔNG TIN
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text
              onPress={() => {
                setModal(false);
                initData();
              }}
              style={{flex: 1}}
            />
          </View>
          <Text
            onPress={() => {
              setModal(false);
              initData();
            }}
            style={{flex: 1}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};
