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
    if (data != undefined && data != '') {
      getResponse();
    }
  }, [close]);

  async function getResponse() {
    const res = await getCTBaiKiemTra(data.MaSV, data.MaBaiKT);
    setResData(res.data[0]);
    console.log('This item detail: ', resData);
    setIsDowload(false);
  }

  return (
    <Modal animationType={'fade'} transparent={true} visible={modalVisible}>
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.buttonBox}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => close(false)}>
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
              <View
                style={{
                  marginTop: -15,
                  padding: 8,
                }}>
                <Text style={textStyles.title}>
                  {resData != undefined ? resData.TenLopHP : ''}
                </Text>
                <Text style={[textStyles.title, {fontSize: 13}]}>
                  {resData != undefined ? resData.TenBaiKT : ''}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  borderColor: mainColor,
                  marginHorizontal: '20%',
                }}>
                <Text style={textStyles.date}>
                  {resData != undefined ? resData.Ngay : ''}
                </Text>

                <Text> {resData != undefined ? resData.ThoiGianLam : ''}</Text>
              </View>
              <View style={inputKeyBox.container}>
                <TouchableOpacity
                  onPress={() => {
                    if (resData.KeyBaiKT == keyInput) {
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
              <Text>
                {'   '}Liên hệ: {resData != undefined ? resData.Mail : ''}
              </Text>
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
