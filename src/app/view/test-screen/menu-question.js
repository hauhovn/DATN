import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Icon} from 'native-base';
//styles
import {appBar, styles} from './styles';
//components
import {ItemQuestion} from './item';
//test
import {testData} from './test-data';
import {settings} from '../../config';
import {AppRouter} from '../../navigation/AppRouter';
import {KEYS} from '../../asset/keys';

export const MenuQuestion = ({navigation}) => {
  const [data, setData] = useState(testData);
  const {width, height} = Dimensions.get('window');
  const handlePressItem = item => {
    navigation.navigate(AppRouter.TESTING, {QUESTION_ID: item.stt});
  };

  return (
    <View style={{flex: 1}}>
      <View style={appBar.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack(); // Quay về màn hình trước
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
          backgroundColor: '#fff',
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
              backgroundColor: settings.colors.colorMain,
              borderWidth: 1,
              borderColor: '#CFD8DC',
            }}
          />
          <Text style={myStyles.textTur}>Đã làm</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              height: width / 10 - 12,
              width: width / 10 - 12,
              borderRadius: 10,
              backgroundColor: settings.colors.colorGreen,
              borderWidth: 1,
              borderColor: '#CFD8DC',
            }}
          />
          <Text style={myStyles.textTur}>Chưa làm</Text>
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
  );
};

const myStyles = StyleSheet.create({
  textTur: {
    marginLeft: 10,
    fontSize: 16,
  },
});
