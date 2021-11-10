import {Icon} from 'native-base';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {settings} from '../../../config';

export const RenderItem = ({
  item,
  data,
  handle,
  del,
  handlePressButton,
  user,
  onEdit,
  onDelete,
  onDone,
}) => {
  const getMarginTop = () => {
    if (item.MaCD === data[0].MaCD) {
      return 10;
    } else {
      return 0;
    }
  };

  const marginBottom = () => {
    if (
      item.MaLopHP === data[data.length - 1].MaLopHP ||
      item.MaLopHP === data[data.length - 2].MaLopHP
    ) {
      return 5;
    } else {
      return 5;
    }
  };

  const pressItem = () => {
    handle(item);
  };

  const pressDelete = () => {
    del(item);
  };

  // console.log(user);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        pressItem();
      }}
      style={{
        width: '45.5%',
        marginLeft: '3%',
        marginTop: getMarginTop(),
        marginBottom: marginBottom(),
        borderRadius: 6,
        backgroundColor: '#fff',
        borderColor: settings.colors.colorThumblr,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
      }}>
      <View style={{flex: 1}}>
        <Text
          numberOfLines={3}
          style={{
            color: settings.colors.colorThumblr,
            width: '100%',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
          }}>
          {item.TenLopHP}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: settings.colors.colorThumblr,
            width: '100%',
            fontSize: 12,
            marginBottom: 10,
          }}>
          Môn: {item.TenMonHoc}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: settings.colors.colorThumblr,
            fontSize: 12,
            width: '100%',
            marginBottom: 10,
          }}>
          Lớp: {item.TenLop}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            color: settings.colors.colorThumblr,
            fontSize: 12,
            width: '100%',
            marginBottom: 10,
          }}>
          Trạng thái: {item.TrangThai == 0 ? 'Sẵn sàng' : 'Đã hoàn thành'}
        </Text>

        <View style={{flex: 1}} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              handlePressButton(item);
            }}
            activeOpacity={0.5}
            style={{
              width: '100%',
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#65ca69',
              borderRadius: 4,
            }}>
            <Text style={{color: '#fff', fontSize: 12}}>
              Danh sách sinh viên
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              onDone(item);
            }}
            activeOpacity={0.5}
            style={{
              width: '100%',
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#42A5F5',
              borderRadius: 4,
              marginTop: 10,
            }}>
            <Text style={{color: '#fff', fontSize: 12}}>Hoàn Thành</Text>
          </TouchableOpacity>
        </View>

        {user[0]?.isAdmin !== undefined && parseInt(user[0]?.isAdmin) === 1 && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                onEdit(item);
              }}
              activeOpacity={0.5}
              style={{
                flex: 1,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#8D6E63',
                borderRadius: 4,
                marginTop: 10,
                marginRight: 5,
                marginBottom: 2,
              }}>
              <Icon
                type="FontAwesome"
                name="edit"
                style={{color: '#fff', fontSize: 16}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onDelete(item);
              }}
              activeOpacity={0.5}
              style={{
                flex: 1,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#EF5350',
                borderRadius: 4,
                marginTop: 10,
                marginLeft: 5,
                marginBottom: 2,
              }}>
              <Icon
                type="AntDesign"
                name="delete"
                style={{color: '#fff', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
