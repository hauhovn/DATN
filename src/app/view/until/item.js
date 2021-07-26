import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const ItemJoinLeaveRoom = ({item}) => {
  let brColor = '#118011';

  switch (item.status) {
    case 1: {
      brColor = '#02ad02';
      break;
    }
    case 2: {
      brColor = '#d1660f';
      break;
    }
    case 3: {
      brColor = '#d1b10f';
      break;
    }
    case 0: {
      brColor = '#ed1818';
      break;
    }
  }
  var today = new Date();
  var date = today.getHours() + 'h' + today.getMinutes() + 'm';
  return (
    <View style={[styles.container, {backgroundColor: brColor}]}>
      <Text style={[styles.text]}>{item?.name}</Text>
      <Text style={{fontSize: 13, color: '#e9e9e9'}}>
        {item?.info} [{date}]
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
