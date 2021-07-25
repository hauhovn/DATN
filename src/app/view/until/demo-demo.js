import React from 'react';
import {View, Text} from 'native-base';
export const DEMODEMO = ({route, navigation}) => {
  const data = route.params?.data;
  console.log('mdata====', data);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 45}}>=={data?.TenSV}==</Text>
    </View>
  );
};
