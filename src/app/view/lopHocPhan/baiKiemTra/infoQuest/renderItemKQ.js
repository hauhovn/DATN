import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import {settings} from '../../../../config';

export const RenderItemKQ = ({item, data, handle, handleDelete}) => {
  const getMarginTop = () => {
    if (item?.CauHoi === data[0]?.CauHoi) {
      return 0;
    } else {
      return 5;
    }
  };

  // Render qq
  const marginBottom = () => {
    if (item?.CauHoi === data[data.length - 1]?.CauHoi) {
      return 70;
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
  const getDate = date => {
    const newDate = new Date(date);
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
      activeOpacity={1}
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
          Tên sinh viên: {item?.TenSV}
        </Text>
        <Text numberOfLines={1} style={{width: '100%', fontSize: 12}}>
          Điểm: {item?.Diem}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
