import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import {settings} from '../../../../config';

export const RenderItemKQ = ({item, data, handle, handleDelete}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        marginHorizontal: '3%',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: item?.Diem * 10 < 5 ? '#EF9A9A' : settings.colors.colorBoderDark,
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
        <Icon type="AntDesign" name="user" style={{fontSize: 22, color: '#fff'}} />
      </View>

      <View style={{flex: 1}}>
        <Text numberOfLines={1} style={{width: '100%', fontWeight: 'bold'}}>
          Tên sinh viên: {item?.TenSV}
        </Text>
        <Text numberOfLines={1} style={{width: '100%', fontSize: 14}}>
          Điểm: {parseFloat(item?.Diem * 10).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
