import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';
import {settings} from '../../config';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Slide} from '../../components/slide';

const {width: dW, height: dH} = Dimensions.get('window');

const colors = settings.colors;

const slideData = [
  {
    title: 'Quản lý tài khoản giáo viên, sinh viên',
    content:
      'Tài khoản đăng nhập của giáo viên, sinh viên sẽ được quản lý trực tiếp trên ứng dụng để người dùng dễ dàng quản lý hơn',
  },
  {
    title: 'Quản lý môn học, bài kiểm tra...',
    content:
      'Các vấn đề liên quan đến môn học, bài kiểm tra, thực hiện kiểm tra online cũng được thực hiện ngay trên ứng dụng và không cần có sự can thiệp của bên thứ ba',
  },
  {
    title: 'Quản lý chặc chẽ sinh viên khi làm bài kiểm tra trên ứng dụng',
    content:
      'Mọi hoạt động của sinh viên như tham gia, số câu đã làm, ra vào ứng dụng để được ứng dụng ghi lại và quản lí chặt chẽ',
  },
];

export const AboutMe = () => {
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  // load321.gif

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <View
        style={{
          height: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.5}
          style={{}}>
          <Icon type="MaterialIcons" name="keyboard-arrow-left" />
        </TouchableOpacity>
        <Text style={{fontSize: 16}}>Thông tin ứng dụng</Text>
        <TouchableOpacity activeOpacity={0.5} style={{}}>
          <Icon
            type="MaterialIcons"
            name="keyboard-arrow-left"
            style={{color: '#fff'}}
          />
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
        <Image
          resizeMode="contain"
          source={require('../../assets/images/oopxx.png')}
          style={{width: dW - 50, height: undefined, aspectRatio: 1}}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginBottom: 20}}>
          LÀM BÀI KIỂM TRA ONLINE
        </Text>
        <Text style={{fontSize: 16, marginBottom: 20}}>
          Hướng dẫn: (thầy) Lê Viết Hoàng Nguyên
        </Text>
        <Text style={{fontSize: 16, marginBottom: 20}}>
          Thực hiện: Bảo Châu, Văn Hậu
        </Text>
        <Text style={{fontSize: 16, marginBottom: 20}}>Phiên bản: 1.0.0</Text>
      </View>
    </View>
  );
};
