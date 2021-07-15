import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'native-base';

export const MyAppBar = ({
  navigation,
  title = 'Title',
  leftIconName = '',
  leftIconType,
  rightIconName = '',
  rightIconType,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log(title);
        }}>
        <Text>123</Text>
      </TouchableOpacity>
      <Text>123</Text>
      <TouchableOpacity
        onPress={() => {
          console.log(title);
        }}>
        <Text>123</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
  },
});
