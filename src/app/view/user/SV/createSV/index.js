import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {settings} from '../../../../config';
import {Textarea, CheckBox, Icon} from 'native-base';
import {Header} from '../../../../components/header';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {AppRouter} from '../../../../navigation/AppRouter';
import {createCH} from '../../../../../server/MonHoc/createCH';
import {Colors, ErrorNotification, GreenStyles} from 'green-native';
import {createGV} from '../../../../../server/GiangVien/addGV';
import {updateGVnew} from '../../../../../server/GiangVien/updateGV';
import {getLop} from '../../../../../server/Lop/getLop/index.js';
import {Picker} from '@react-native-picker/picker';
import {createSV} from '../../../../../server/SinhVien/addSV';
import {updateSVnew} from '../../../../../server/SinhVien/updateSVnew';

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const CreateNewSV = () => {
  const nav = useNavigation();
  const route = useRoute();
  const user = route.params.user;

  let pickerRef = useRef();

  const [tenGV, setTenGV] = useState('');
  const [gioiTinh, setGioiTinh] = useState(0);
  const [diaChi, setDiaChi] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lop, setLop] = useState(0);
  const [admin, setAdmin] = useState(0);
  const [trangThai, setTrangThai] = useState(0);

  const [showPassword, setShowPassword] = useState(true);
  const [errorText, setErrorText] = useState('');

  const [dataLop, setDataLop] = useState('');

  const [lopLable, setLopLable] = useState('');

  useEffect(() => {
    getDataLop();
    if (route.params.type === 1) {
      setTenGV(route.params.data?.TenSV);
      setGioiTinh(parseInt(route.params.data?.GioiTinh));
      setDiaChi(route.params.data?.DiaChi);
      setSoDienThoai(route.params.data?.SDT);
      setMail(route.params.data?.Mail);
      setTrangThai(parseInt(route.params.data?.TrangThai));
      setLop(parseInt(route.params.data?.MaLop));
      // setMail(route.params.data?.Mail);
    }
  }, []);

  const getDataLop = async () => {
    try {
      const response = await getLop();
      setDataLop(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postData = async () => {
    try {
      const response = await createSV(
        tenGV,
        gioiTinh,
        diaChi,
        soDienThoai,
        mail,
        password,
        lop,
      );

      console.log(response);
      Toast.show(response?.status, Toast.SHORT);

      if (response?.status === 'Thành công"') {
        nav.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const postEdit = async () => {
    try {
      await updateSVnew(route.params?.data?.MaSV, tenGV, gioiTinh, diaChi, 1);
      Toast.show('Thành công', Toast.SHORT);
      nav.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddGV = () => {
    setErrorText('');
    if (tenGV.trim() === '') {
      setErrorText('Vui lòng nhập tên giáo viên');
    } else {
      if (diaChi.trim() === '') {
        setErrorText('Vui lòng nhập địa chỉ');
      } else {
        if (soDienThoai.trim() === '') {
          setErrorText('Vui lòng nhập số điện thoại');
        } else {
          if (mail.trim() === '') {
            setErrorText('Vui lòng nhập email');
          } else {
            if (password.trim() === '') {
              setErrorText('Vui lòng nhập mật khẩu');
            } else {
              if (password !== confirmPassword) {
                setErrorText('Mật khẩu không khớp');
              } else {
                if (password.length < 7) {
                  setErrorText('Mật khẩu phải dài hơn 6 ký tự');
                } else {
                  if (reg.test(mail) === false) {
                    setErrorText('Email không đúng định dạng');
                  } else {
                    if (soDienThoai.length < 10) {
                      setErrorText('Số điện thoại không đúng');
                    } else {
                      postData();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  const handleEditGV = () => {
    setErrorText('');
    if (tenGV.trim() === '') {
      setErrorText('Vui lòng nhập tên giáo viên');
    } else {
      if (diaChi.trim() === '') {
        setErrorText('Vui lòng nhập địa chỉ');
      } else {
        postEdit();
      }
    }
  };

  // render
  return (
    <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#fff'}}>
      <Header user={user} />

      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text style={styles.title}>
            {route.params.type === 0 ? 'THÊM SINH VIÊN' : 'SỬA SINH VIÊN'}
          </Text>
        </View>
        <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
          <Text style={styles.inputTitle}>Tên sinh viên</Text>

          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập tên"
                placeholderTextColor="#B0BEC5"
                value={tenGV}
                onChangeText={t => {
                  setTenGV(t);
                }}
                style={styles.input}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.inputTitle}>Giới tính</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <CheckBox
                checked={gioiTinh === 0 ? true : false}
                onPress={() => {
                  setGioiTinh(0);
                }}
                color={
                  gioiTinh === 0
                    ? settings.colors.colorBlue
                    : settings.colors.colorGreen
                }
                style={{width: 14, height: 14, borderRadius: 500}}
              />
              <TouchableOpacity
                onPress={() => {
                  setGioiTinh(0);
                }}>
                <Text
                  style={{
                    marginLeft: 15,
                    paddingVertical: 2,
                    color:
                      gioiTinh === 0
                        ? settings.colors.colorBlue
                        : settings.colors.colorThumblr,
                  }}>
                  Nam
                </Text>
              </TouchableOpacity>

              <CheckBox
                checked={gioiTinh === 1 ? true : false}
                onPress={() => {
                  setGioiTinh(1);
                }}
                color={
                  gioiTinh === 1
                    ? settings.colors.colorBlue
                    : settings.colors.colorGreen
                }
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 500,
                  marginLeft: 20,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setGioiTinh(1);
                }}>
                <Text
                  style={{
                    marginLeft: 15,
                    paddingVertical: 2,
                    color:
                      gioiTinh === 1
                        ? settings.colors.colorBlue
                        : settings.colors.colorThumblr,
                  }}>
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.inputTitle}>Địa chỉ</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nhập địa chỉ"
                placeholderTextColor="#B0BEC5"
                value={diaChi}
                onChangeText={t => {
                  setDiaChi(t);
                }}
                style={styles.input}
              />
            </View>

            {route.params.type === 0 && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.inputTitle}>Số điện thoại</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#B0BEC5"
                    value={soDienThoai}
                    keyboardType="number-pad"
                    onChangeText={t => {
                      setSoDienThoai(t);
                    }}
                    style={styles.input}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.inputTitle}>Nhập email</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Nhập email"
                    placeholderTextColor="#B0BEC5"
                    value={mail}
                    onChangeText={t => {
                      setMail(t);
                    }}
                    style={styles.input}
                  />
                </View>
              </>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.inputTitle}>Chọn lớp</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (dataLop.length !== 0) {
                  pickerRef.current.focus();
                }
              }}
              style={[styles.inputContainer, {justifyContent: 'center'}]}>
              <Text style={{marginHorizontal: 10}}>{lopLable}</Text>
            </TouchableOpacity>

            {route.params.type === 0 && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.inputTitle}>Nhập mật khẩu</Text>
                </View>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                    styles.inputContainer,
                  ]}>
                  <TextInput
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor="#B0BEC5"
                    value={password}
                    secureTextEntry={showPassword}
                    onChangeText={t => {
                      setPassword(t);
                    }}
                    style={styles.input}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}
                    activeOpacity={0.5}
                    style={{
                      padding: 5,
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name={!showPassword ? 'eye' : 'eye-off'}
                      style={{fontSize: 16, color: 'grey'}}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.inputTitle}>Nhập lại mật khẩu</Text>
                </View>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                    styles.inputContainer,
                  ]}>
                  <TextInput
                    placeholder="Nhập lại mật khẩu"
                    placeholderTextColor="#B0BEC5"
                    value={confirmPassword}
                    secureTextEntry={showPassword}
                    onChangeText={t => {
                      setConfirmPassword(t);
                    }}
                    style={styles.input}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setShowPassword(!showPassword);
                    }}
                    activeOpacity={0.5}
                    style={{
                      padding: 5,
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name={!showPassword ? 'eye' : 'eye-off'}
                      style={{fontSize: 16, color: 'grey'}}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {route.params.type === 1 && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.inputTitle}>Trạng thái</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <CheckBox
                    checked={trangThai === 0 ? true : false}
                    onPress={() => {
                      setTrangThai(0);
                    }}
                    color={
                      trangThai === 0
                        ? settings.colors.colorBlue
                        : settings.colors.colorGreen
                    }
                    style={{width: 14, height: 14, borderRadius: 500}}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setTrangThai(0);
                    }}>
                    <Text
                      style={{
                        marginLeft: 15,
                        paddingVertical: 2,
                        color:
                          trangThai === 0
                            ? settings.colors.colorBlue
                            : settings.colors.colorThumblr,
                      }}>
                      Hoạt động
                    </Text>
                  </TouchableOpacity>

                  <CheckBox
                    checked={trangThai === 1 ? true : false}
                    onPress={() => {
                      setTrangThai(1);
                    }}
                    color={
                      trangThai === 1 ? Colors.red : settings.colors.colorGreen
                    }
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 500,
                      marginLeft: 20,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setTrangThai(1);
                    }}>
                    <Text
                      style={{
                        marginLeft: 15,
                        paddingVertical: 2,
                        color:
                          trangThai === 1
                            ? Colors.red
                            : settings.colors.colorThumblr,
                      }}>
                      Không hoạt động
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={{height: 10}} />
          </View>
        </ScrollView>
      </View>

      <ErrorNotification
        text={errorText}
        marginHorizontal={10}
        color={Colors.red}
      />

      <TouchableOpacity
        onPress={() => {
          route.params.type === 0 ? handleAddGV() : handleEditGV();
        }}
        activeOpacity={0.5}
        style={[styles.button]}>
        <Text style={{color: '#ffF', fontSize: 14, fontWeight: 'bold'}}>
          {route.params.type === 0 ? 'THÊM SINH VIÊN' : 'LƯU LẠI'}
        </Text>
      </TouchableOpacity>

      {dataLop !== '' && (
        <View style={{flex: 0, width: 0, height: 0}}>
          <Picker
            ref={pickerRef}
            mode="dialog"
            selectedValue={lop}
            onValueChange={(value, index) => {
              setLop(value);
              setLopLable(dataLop[index].TenLop);
            }}
            style={{width: 0, opacity: 0, height: 0}}>
            {dataLop?.map(i => (
              <Picker.Item key={i.MaLop} label={i.TenLop} value={i.MaLop} />
            ))}
          </Picker>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: settings.colors.colorGreen,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5,
  },
  inputTitle: {
    color: settings.colors.colorGreen,
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: settings.colors.colorBoderDark,
    height: 45,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 2,
  },
  button: {
    height: 45,
    backgroundColor: settings.colors.colorGreen,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
