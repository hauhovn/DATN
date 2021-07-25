import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const ItemJoinLeaveRoom = ({item}) => {
  console.log(item);
  let brColor, info;

  if (item.isConnect) {
    brColor = '#118011';
    info = 'đã vào phòng thi';
  } else {
    brColor = '#ed1818';
    info = 'đã rời khỏi phòng thi';
  }
  1;
  2;
  var today = new Date();
  var date = today.getHours() + ' giờ ' + today.getMinutes() + ' phút';
  return (
    <View style={[styles.container, {backgroundColor: brColor}]}>
      <Text style={[styles.text]}>{item?.name}</Text>
      <Text style={{fontSize: 12, color: '#e9e9e9'}}>
        {info} [{date}]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 3,
    padding: 8,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});
