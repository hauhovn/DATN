import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import {settings} from '../../../config';
import Moment from 'moment';

export const RenderItem = ({item, data, handle, handleDelete}) => {
  const getMarginTop = () => {
    if (item?.id === data[0]?.id) {
      return 5;
    } else {
      return 0;
    }
  };

  const marginBottom = () => {
    if (item?.MaBaiKT === data[data.length - 1]?.MaBaiKT) {
      return 20;
    } else {
      return 5;
    }
  };

  const pressItem = () => {
    handle(item);
  };

  const deleteQuest = () => {
    handleDelete(item);
  };

  // vậy đó
  const getNum = num => {
    return num < 10 ? '0' + num : num;
  };

  // Lấy ra dạng ngày-tháng-năm
  const getStrDate = date => {
    const newDate = new Date(Moment(date));
    return (
      getNum(newDate.getDate()) +
      '-' +
      getNum(newDate.getMonth() + 1) +
      '-' +
      newDate.getFullYear()
    );
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
      <View
        style={{
          backgroundColor: settings.colors.colorGreen,
          width: 45,
          height: 45,
          borderRadius: 600,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}>
        <Icon
          type="Ionicons"
          name="md-book"
          style={{fontSize: 20, color: '#fff', marginBottom: -2}}
        />
      </View>

      <View style={{flex: 1}}>
        <Text numberOfLines={1} style={{width: '100%', fontWeight: 'bold'}}>
          {item?.TenBaiKT}
        </Text>
        <Text numberOfLines={1} style={{width: '100%', fontSize: 12}}>
          Ngày: {getStrDate(item?.Ngay)}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            width: '100%',
            fontSize: 12,
            color:
              parseInt(item?.TrangThai) === 0
                ? 'green'
                : parseInt(item?.TrangThai) === 1
                ? 'blue'
                : parseInt(item?.TrangThai) === 2
                ? 'pink'
                : parseInt(item?.TrangThai) === 3
                ? 'orange'
                : 'red',
          }}>
          {parseInt(item?.TrangThai) === 0
            ? 'Mới tạo'
            : parseInt(item?.TrangThai) === 1
            ? 'Đã hoàn thành'
            : parseInt(item?.TrangThai) === 2
            ? 'Đang kiểm tra'
            : parseInt(item?.TrangThai) === 3
            ? 'Đang tạm dừng'
            : 'Đã kết thúc'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          deleteQuest();
        }}
        activeOpacity={0.5}
        style={{
          width: 40,
          height: 40,
          marginLeft: 10,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
        <Icon
          type="AntDesign"
          name="delete"
          style={{fontSize: 20, color: '#ef5350', marginBottom: -2}}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
