import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRouter } from '../AppRouter';
import TabNavigator from '../TabNavigation/index';
import { ChangePassword } from '../../view/profile/changePassword';
import { UpdateProfile } from '../../view/profile/updateProfile';
import { DemoView } from '../../view/until/demo-view';
import { TestingNavigation } from '../TestingNavigation';
import { TeacherControl } from '../../view/teacherControl';

// Student
import { TestScreen } from '../../view/student/views'

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
                options={{ title: AppRouter.TAB, headerShown: false }}
                component={TabNavigator}
            />
            <Stack.Screen
                name={AppRouter.CHANGEPASS}
                options={{ title: AppRouter.CHANGEPASS, headerShown: false }}
                component={ChangePassword}
            />
            <Stack.Screen
                name={AppRouter.PROFILE}
                options={{ title: AppRouter.PROFILE, headerShown: false }}
                component={UpdateProfile}
            />
            <Stack.Screen
                name={AppRouter.DEMO_VIEW}
                component={DemoView}
                options={{ title: AppRouter.DEMO_VIEW, headerShown: false }}
            />
            <Stack.Screen
                name={AppRouter.TESTING}
                component={TestScreen}
                options={{ title: AppRouter.TESTING, headerShown: false }}
            />
            <Stack.Screen
                name={AppRouter.TEACHERCONTROLL}
                component={TeacherControl}
                options={{ title: AppRouter.TEACHERCONTROLL, headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default MainNavigation;
