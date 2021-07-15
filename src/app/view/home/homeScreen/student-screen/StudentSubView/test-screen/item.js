import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
//
import {settings} from '../../../../../../config';

export const ItemQuestion = ({item, data, handle}) => {
  const pressItem = () => {
    handle(item);
  };
  const {width, height} = Dimensions.get('window');
  let itemColor = settings.colors.colorGreen;
  if (item.dachon != null && item.dachon != undefined && item.dachon != '') {
    itemColor = settings.colors.colorMain;
  } else if (item.status == 0) {
    itemColor = settings.colors.colorRed;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        pressItem();
      }}
      style={{
        height: width / 7,
        width: width / 7,
        marginHorizontal: 10,
        padding: 10,
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: itemColor,
        borderWidth: 1,
        borderColor: '#CFD8DC',
      }}>
      <Text
        style={{
          flex: 10,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#fff',
        }}>
        {item?.STT}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {},
});
