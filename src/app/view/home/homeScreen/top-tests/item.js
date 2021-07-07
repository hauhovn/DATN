import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ItemTest = (item, handle) => {
  console.log('item ne: ', item);
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text>Item - Top tests: </Text>
    </View>
  );
};

export {ItemTest};
