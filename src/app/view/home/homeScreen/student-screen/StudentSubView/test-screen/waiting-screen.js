import React from 'react';
import {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
//moduns
import io from 'socket.io-client/dist/socket.io.js';
//
import {AppRouter} from '../../../../../../navigation/AppRouter';
import {RemoteTime} from '../../../../../../components/time-remote';

export const WaitingScreen = ({route, navigation}) => {
  //Consts

  const data = route.params?.data;
  console.log('mdata====', data);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 45}}>=={data?.TenSV}==</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(AppRouter.TESTING, {data: data});
        }}
        style={{padding: 30, borderWidth: 1, margin: 10, borderRadius: 50}}>
        <Text>Testing</Text>
      </TouchableOpacity>
    </View>
  );
};
