import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//compoments
import {WaitingScreen} from '../../view/home/homeScreen/student-screen/StudentSubView/test-screen/waiting-screen';
//
//test-start
import {DEMODEMO} from './demo-demo';
//test-end

const Stack = createStackNavigator();

export const DEMO_NAVIGATION = ({route}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'DEMODEMO'}
        options={{title: 'DEMODEMO', headerShown: false}}
        component={DEMODEMO}
      />
    </Stack.Navigator>
  );
};
