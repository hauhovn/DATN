import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//compoments
import {TestScreen} from '../../view/home/homeScreen/student-screen/StudentSubView/test-screen';
import {MenuQuestion} from '../../view/home/homeScreen/student-screen/StudentSubView/test-screen/menu-question';
import WaitingScreen from '../../view/home/homeScreen/student-screen/StudentSubView/test-screen/waiting-screen';
//
import {AppRouter} from '../AppRouter';
//test-start
import {CalendarScreen} from '../../view/calendar';
//test-end

const Stack = createStackNavigator();

export const TestingNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRouter.WAITING_SCREEN}
        options={{title: AppRouter.WAITING_SCREEN, headerShown: false}}
        component={WaitingScreen}
      />
      <Stack.Screen
        name={AppRouter.TESTING}
        options={{title: AppRouter.LOGIN, headerShown: false}}
        component={TestScreen}
      />
      <Stack.Screen
        name={AppRouter.MENU_QUESTION}
        options={{title: AppRouter.MENU_QUESTION, headerShown: false}}
        component={MenuQuestion}
      />
    </Stack.Navigator>
  );
};
