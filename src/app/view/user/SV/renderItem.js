import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import {settings} from '../../../config';
import {Colors} from 'green-native';

export const RenderItem = ({item, data, handle, handleDelete}) => {
  const getMarginTop = () => {
    if (item?.MaSV === data[0]?.MaSV) {
      return 0;
    } else {
      return 10;
    }
  };

  const marginBottom = () => {
    if (item?.MaSV === data[data.length - 1]?.MaSV) {
      return 30;
    } else {
      return 5;
    }
  };

  const pressItem = () => {
    handle(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        pressItem();
      }}
      style={{
        marginTop: getMarginTop(),
        marginHorizontal: '3%',
        marginBottom: marginBottom(),
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: settings.colors.colorBoderDark,
        width: '94%',
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}>
      <View style={{flex: 1, marginLeft: 5}}>
        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            type="FontAwesome5"
            name="user-alt"
            style={{fontSize: 14, color: '#007f5f', width: 20}}
          />
          <Text numberOfLines={1} style={{fontWeight: 'bold', fontSize: 14}}>
            Tên: {item?.TenSV}
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            type="FontAwesome"
            name="intersex"
            style={{fontSize: 14, color: '#9e2a2b', width: 20}}
          />
          <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
            Gới tính: {parseInt(item?.GioiTinh) === 0 ? 'Nam' : 'Nữ'}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            type="Fontisto"
            name="phone"
            style={{fontSize: 14, color: '#6a994e', width: 20}}
          />
          <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
            Số điện thoại: {item?.SDT}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            type="Ionicons"
            name="mail"
            style={{fontSize: 14, color: '#ea638c', width: 20}}
          />
          <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
            Mail: {item?.Mail}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            type="Ionicons"
            name="location-sharp"
            style={{fontSize: 14, color: '#bc4749', width: 20}}
          />
          <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
            Địa chỉ: {item?.DiaChi}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            type="FontAwesome"
            name="building-o"
            style={{fontSize: 14, color: Colors.purpleDark, width: 20}}
          />
          <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
            Lớp: {item?.TenLop}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          {parseInt(item?.TrangThai) === 0 ? (
            <Icon
              type="Fontisto"
              name="radio-btn-active"
              style={{fontSize: 14, color: '#4CAF50', width: 20}}
            />
          ) : (
            <Icon
              type="FontAwesome5"
              name="lock"
              style={{fontSize: 14, color: Colors.red, width: 20}}
            />
          )}

          <Text
            numberOfLines={1}
            style={{
              width: '100%',
              fontSize: 14,
              color: parseInt(item?.TrangThai) === 0 ? '#4CAF50' : Colors.red,
              fontWeight: 'bold',
            }}>
            {parseInt(item?.TrangThai) === 0 ? 'Hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
