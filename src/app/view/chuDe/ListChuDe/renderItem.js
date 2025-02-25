import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Icon, Fab} from 'native-base';
import {settings} from '../../../config';

const {width: dW, height: dH} = Dimensions.get;

export const RenderItem = ({item, data, handle, del, user}) => {
  const getMarginTop = () => {
    if (item.MaCD === data[0].MaCD) {
      return 10;
    } else {
      return 0;
    }
  };

  const marginBottom = () => {
    if (item.MaCD === data[data.length - 1].MaCD) {
      return 100;
    } else {
      return 15;
    }
  };

  const pressItem = () => {
    handle(item);
  };

  const pressDelete = () => {
    del(item);
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
        borderColor: settings.colors.colorThumblr,
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{marginLeft: 15, flex: 1}}>
        <Text
          numberOfLines={1}
          style={{
            color: settings.colors.colorThumblr,
            width: '100%',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          Chủ đề: {item.TenCD}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: '#000',
          }}>
          Số tín chỉ: {item.SoTinChi} - Số tiết: {item.SoTiet}
        </Text>
      </View>

      {user[0]?.isAdmin !== undefined && (
        <TouchableOpacity
          onPress={() => {
            pressDelete();
          }}
          activeOpacity={0.5}
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: settings.colors.colorThumblr,
            height: '100%',
            marginRight: -1,
            borderTopEndRadius: 10,
            borderBottomEndRadius: 10,
          }}>
          <Icon
            type="AntDesign"
            name="delete"
            style={{fontSize: 22, color: '#fff'}}
          />
          <Text
            style={{
              color: '#fff',
              marginTop: 5,
              fontSize: 12,
            }}>
            Xóa
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
