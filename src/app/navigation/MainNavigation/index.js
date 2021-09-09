import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRouter} from '../AppRouter';
import TabNavigator from '../TabNavigation/index';
import {ChangePassword} from '../../view/profile/changePassword';
import {UpdateProfile} from '../../view/profile/updateProfile';
import {DemoView} from '../../view/until/demo-view';
import {TeacherControl} from '../../view/teacherControl';

// Student
import {TestScreen, TestResultScreen} from '../../view/student/views';
import {CreateNewGV} from '../../view/user/GV/createGV';
import {CreateNewSV} from '../../view/user/SV/createSV';
import {AboutMe} from '../../view/about';

const Stack = createStackNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={AppRouter.TAB}
      headerMode="none"
      screenOptions={{
        headerTransparent: true,
      }}>
      <Stack.Screen
        name={AppRouter.TAB}
        options={{title: AppRouter.TAB, headerShown: false}}
        component={TabNavigator}
      />
      <Stack.Screen
        name={AppRouter.CHANGEPASS}
        options={{title: AppRouter.CHANGEPASS, headerShown: false}}
        component={ChangePassword}
      />
      <Stack.Screen
        name={AppRouter.PROFILE}
        options={{title: AppRouter.PROFILE, headerShown: false}}
        component={UpdateProfile}
      />
      <Stack.Screen
        name={AppRouter.DEMO_VIEW}
        component={DemoView}
        options={{title: AppRouter.DEMO_VIEW, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.TESTING}
        component={TestScreen}
        options={{title: AppRouter.TESTING, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.TEST_RESULT}
        component={TestResultScreen}
        options={{title: AppRouter.TEST_RESULT, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.TEACHERCONTROLL}
        component={TeacherControl}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'NEWGV'}
        component={CreateNewGV}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'NEWSV'}
        component={CreateNewSV}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'AboutMe'}
        component={AboutMe}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default MainNavigation;
