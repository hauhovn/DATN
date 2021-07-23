import React, {useState, useEffect} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import {Icon} from 'native-base';
//
import {settings} from '../../../../../../../config';
//views
import {ItemQuestion} from './item';
import {appBar} from '../../test-screen/styles';

export const MenuQuestionModal = ({isVisible, close, data, menuHandle}) => {
  const {width, height} = Dimensions.get('window');

  let isCheck = {
      //is check or correct
      label: 'Đã làm',
      color: settings.colors.colorMain,
    },
    unCheck = {
      // or incorrect
      label: 'Chưa làm',
      color: settings.colors.colorGreen,
    };
  if (data[0]?.DapAn != undefined) {
    // is test result
    isCheck.color = settings.colors.colorGreen;
    isCheck.label = 'Đúng';

    unCheck.color = settings.colors.colorRed;
    unCheck.label = 'Sai';
  }

  //funcs
  const handlePressItem = item => {
    menuHandle(item);
    close();
  };

  return (
    <Modal visible={isVisible}>
      <View style={{flex: 1}}>
        <View style={appBar.container}>
          <TouchableOpacity
            onPress={() => {
              close(false);
            }}>
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-left"
              style={appBar.buttonIcon}
            />
          </TouchableOpacity>
          <Text style={appBar.textTitle}>Danh sách câu hỏi</Text>
          <Text />
        </View>
        <View
          style={{
            width: '100%',
            height: 46,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: width / 10 - 12,
                width: width / 10 - 12,
                borderRadius: 10,
                backgroundColor: isCheck.color,
                borderWidth: 1,
                borderColor: '#CFD8DC',
              }}
            />
            <Text style={myStyles.textTur}>{isCheck.label}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: width / 10 - 12,
                width: width / 10 - 12,
                borderRadius: 10,
                backgroundColor: unCheck.color,
                borderWidth: 1,
                borderColor: '#CFD8DC',
              }}
            />
            <Text style={myStyles.textTur}>{unCheck.label}</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            margin: '2%',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            data={data}
            numColumns={5}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <ItemQuestion item={item} data={data} handle={handlePressItem} />
            )}
            keyExtractor={item => item.id}
            style={{flex: 1, paddingTop: 10}}
          />
        </View>
      </View>
    </Modal>
  );
};

const myStyles = StyleSheet.create({
  textTur: {
    marginLeft: 10,
    fontSize: 16,
  },
});
