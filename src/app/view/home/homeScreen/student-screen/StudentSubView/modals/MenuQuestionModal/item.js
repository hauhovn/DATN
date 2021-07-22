import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
//
import {settings} from '../../../../../../../config';

export const ItemQuestion = ({item, handle}) => {
  const pressItem = () => {
    handle(item.STT);
  };
  const {width, height} = Dimensions.get('window');
  let itemColor = settings.colors.colorMain;
  if (item?.DASV == 'X') {
    itemColor = settings.colors.colorGreen;
  } else if (item?.DapAn != undefined) {
    if (item?.DapAn != item?.DASV) {
      // incorrect
      itemColor = settings.colors.colorRed;
    } else {
      itemColor = settings.colors.colorGreen;
    }
  } else {
    itemColor = settings.colors.colorMain;
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
        justifyContent: 'center',
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
