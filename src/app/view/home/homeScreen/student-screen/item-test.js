import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
//STYLEs
const mainColor = '#FF7043';

export const ItemTest = ({item, handle}) => {
  const pressItem = () => {
    handle(item);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => handle(item)}>
      <View style={styles.title}>
        <Text style={styles.titleText}>{item.TenLopHP}</Text>
        <Text>{item.Ngay}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.content}>
          <Text>Bài kiểm tra: {item.TenBaiKT}</Text>
          <Text>Thời gian làm: {item.ThoiGianLam}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: '5%',
    marginBottom: 8,
    height: 90,
    width: '90%',
    borderWidth: 0.6,
    borderColor: mainColor,
    borderRadius: 8,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  content: {
    flexDirection: 'column',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentText: {},
});
