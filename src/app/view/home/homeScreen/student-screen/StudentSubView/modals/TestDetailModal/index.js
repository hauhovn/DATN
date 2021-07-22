import React, {useState, useEffect} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {Icon} from 'native-base';
import Moment from 'moment';

//api
import {getCTBaiKiemTra} from '../../../../../../../../server/BaiKiemTra/getTestDetail';
//colors
import {settings} from '../../../../../../../config';
//css
import {styles, textStyles, inputKeyBox} from './styles';

var mainColor = settings.colors.colorMain;

export const TestDetailModal = ({modalVisible, close, data, pressHandle}) => {
  const [resData, setResData] = useState(undefined);
  const [isDowload, setIsDowload] = useState(true);
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    if (data != undefined && modalVisible) {
      setIsDowload(true);
      getResponse();
      setIsDowload(false);
    }
  }, [close]);

  async function getResponse() {
    console.log(
      'item.MaBaiKT: ',
      data.MaBaiKT,
      ' & SinhVien.MaSV: ',
      data.MaSV,
    );
    const res = await getCTBaiKiemTra(data.MaSV, data.MaBaiKT);
    setResData(res.data[0]);
    console.log('getResponse: ', resData);
    await new Promise(a => setTimeout(a, 5000));
  }

  function resetView() {
    try {
      resData.TenBaiKT = '';
      resData.TenGV = '';
      resData.TenLopHP = '';
      resData.ThoiGianLam = '00:00:00';
      resData.Mail = 'contact@me.com';
      resData.Ngay = '';
      resData.TenMonHoc = '';

      setResData(resData);
    } catch (error) {
      console.log('@Close no go test');
    }
  }

  return (
    <Modal animationType={'fade'} transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                resetView();
                close(false);
              }}>
              <Icon type="AntDesign" name="close" style={styles.icon} />
            </TouchableOpacity>
          </View>
          {!isDowload ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              <View style={styles.title}>
                <Text style={textStyles.title}>{resData?.TenMonHoc} </Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text
                    style={[
                      textStyles.title,
                      {fontSize: 13, color: mainColor, fontWeight: '200'},
                    ]}>
                    Lớp học phần:{' '}
                  </Text>
                  <Text
                    style={[
                      textStyles.title,
                      {fontSize: 15, color: mainColor, fontWeight: 'bold'},
                    ]}>
                    {resData?.TenLopHP}
                  </Text>
                </View>
              </View>
              <View style={styles.time}>
                <Text
                  style={[textStyles.date, {color: settings.colors.colorMain}]}>
                  {resData?.TenBaiKT}
                </Text>
                <Text style={textStyles.date}>
                  Ngày: {Moment(resData?.Ngay)?.format('L')}
                </Text>

                <Text style={textStyles.time}>
                  Thời gian làm: {resData?.ThoiGianLam}
                </Text>
              </View>
              <View style={inputKeyBox.container}>
                <TouchableOpacity
                  onPress={() => {
                    if (resData?.KeyBaiKT == keyInput) {
                      console.log('Nhap dung key');
                      pressHandle(true);
                    } else {
                      console.log('Nhap sai key');
                      Alert.alert('Thông báo', 'Bạn đã nhập sai mã');
                    }
                  }}
                  style={inputKeyBox.box}>
                  <TextInput
                    style={inputKeyBox.inputText}
                    onChangeText={setKeyInput}
                    placeholder={'Nhập mã tham gia'}
                  />
                  <View style={inputKeyBox.button}>
                    <Text style={inputKeyBox.buttonText}>Tham gia</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.contact}>
                <Text style={[textStyles.contact, {marginBottom: 1}]}>
                  Giảng viên: {resData?.TenGV}
                </Text>
                <Text style={textStyles.contact}>Email: {resData?.Mail}</Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                height: '80%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../../../../../../asset/gif/loading-3dot.gif')}
                style={{height: 80, width: 80}}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
