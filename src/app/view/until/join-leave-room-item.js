import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const ItemJoinLeaveRoom = ({item}) => {
  let brColor = '#118011';

  if (item.status == 0) {
    brColor = '#ed1818';
  }
  if (item.status == 1) {
    brColor = '#02ad02';
  }
  if (item.status == 2) {
    brColor = '#d1660f';
  }
  if (item.status == 3) {
    brColor = '#d1b10f';
  }

  var today = new Date();
  var date = today.getHours() + 'h' + today.getMinutes() + 'm';
  let showDate;
  if (item.create_at != '') {
    showDate = item.create_at;
  } else {
    showDate = date;
  }
  return (
    <View style={[styles.container, {backgroundColor: brColor}]}>
      <Text style={[styles.text]}>{item?.name}</Text>
      <Text style={{fontSize: 13, color: '#e9e9e9'}}>
        {item?.info} [{showDate}]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 3,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#fff',
  },
});
