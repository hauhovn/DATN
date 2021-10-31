import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {settings} from '../../config';

import HomeNavigation from '../HomeNavigation';
import CalendarNavigation from '../CalendarNavigation';
import SettingNavigation from '../SettingNavigation';

const Tab = createBottomTabNavigator();

const {width: dW, height: dH} = Dimensions.get('window');

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName;
          if (route.name === 'HOME') {
            iconName = 'home';
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    color === '#fff' ? settings.colors.colorMain : '#fff',
                  width: dW / 3 - 20,
                  height: '90%',
                  borderRadius: 6,
                }}>
                <Entypo
                  name={iconName}
                  size={22}
                  color={color === '#fff' ? '#fff' : settings.colors.colorMain}
                  style={{marginBottom: -2}}
                />
                <Text
                  style={{
                    color:
                      color === '#fff' ? '#fff' : settings.colors.colorMain,
                    fontSize: 12,
                  }}>
                  Home
                </Text>
              </View>
            );
          }
          if (route.name === 'CALENDAR') {
            iconName = 'calendar';
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    color === '#fff' ? settings.colors.colorMain : '#fff',
                  width: dW / 3 - 20,
                  height: '90%',
                  borderRadius: 6,
                }}>
                <FontAwesome
                  name={iconName}
                  size={18}
                  color={color === '#fff' ? '#fff' : settings.colors.colorMain}
                  style={{marginBottom: 2}}
                />
                <Text
                  style={{
                    color:
                      color === '#fff' ? '#fff' : settings.colors.colorMain,
                    fontSize: 12,
                  }}>
                  Lịch kiểm tra
                </Text>
              </View>
            );
          }
          if (route.name === 'SETTING') {
            iconName = 'settings-outline';
            return (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    color === '#fff' ? settings.colors.colorMain : '#fff',
                  width: dW / 3 - 20,
                  height: '90%',
                  borderRadius: 6,
                }}>
                <Ionicons
                  name={iconName}
                  size={22}
                  color={color === '#fff' ? '#fff' : settings.colors.colorMain}
                  style={{marginBottom: -2}}
                />
                <Text
                  style={{
                    color:
                      color === '#fff' ? '#fff' : settings.colors.colorMain,
                    fontSize: 12,
                  }}>
                  Cài đặt
                </Text>
              </View>
            );
          }
        },
      })}
      tabBarOptions={{
        // activeTintColor: settings.colors.colorMain,
        activeTintColor: '#fff',
        inactiveTintColor: settings.colors.colorMain,
        showLabel: false,
      }}>
      <Tab.Screen name="HOME" component={HomeNavigation} />
      <Tab.Screen name="CALENDAR" component={CalendarNavigation} />
      <Tab.Screen name="SETTING" component={SettingNavigation} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
