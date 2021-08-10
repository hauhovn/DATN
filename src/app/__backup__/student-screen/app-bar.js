import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'native-base';

var _backgroundColor = '#FF7043',
  _height = 36,
  _itemColors = '#fff',
  _iconLeftSize,
  _iconRightSize,
  _titleSizes;
export const MyAppBar = ({
  title = 'Title',
  leftIconName = 'chevron-back-outline',
  leftIconType = 'Ionicons',
  rightIconName = 'info',
  rightIconType = 'Entypo',
  brColor = '#FF7043',
  heightSize,
  itemColors,
  titleSize = 24 - 5,
  iconLeftSize = 24,
  iconRightSize = 24 - 5,
  leftHandle,
  rightHandle,
}) => {
  if (brColor != undefined) _backgroundColor = brColor;
  if (heightSize != undefined) _height = parseInt(heightSize);
  if (itemColors != undefined) _itemColors = itemColors;
  if (titleSize != undefined) _titleSizes = titleSize;
  if (iconLeftSize != undefined) _iconLeftSize = iconLeftSize;
  if (iconRightSize != undefined) _iconRightSize = iconRightSize;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={leftHandle}>
        <Icon
          type="Ionicons"
          name="chevron-back-outline"
          style={[styles.items, styles.leftIcon]}
        />
      </TouchableOpacity>
      <Text style={styles.title}></Text>
      <TouchableOpacity onPress={rightHandle}>
        <Icon
          type="Entypo"
          name="info"
          style={[styles.items, styles.rightIcon]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF7043',
  },
  items: {
    color: '#fff',
    marginHorizontal: 5,
  },
  leftIcon: {
    fontSize: 24,
  },
  rightIcon: {
    fontSize: 19,
  },
  title: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
});
