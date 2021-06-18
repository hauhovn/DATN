import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useNavigation  } from "@react-navigation/native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation()
  return (
    <View style={{ flex: 1, alignItems:'center', justifyContent: 'center' }}>
      <TouchableOpacity
      onPress={()=>{
        navigation.navigate('Detail')
      }}
       style={{alignItems:'center', justifyContent: 'center', padding: 10, backgroundColor:'green'}}>
        <Text>CACCCCC</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems:'center', justifyContent: 'center' }}>
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
       style={{alignItems:'center', justifyContent: 'center', padding: 10, backgroundColor:'green'}}>
        <Text>LOLLLLLLLL</Text>
      </TouchableOpacity>
    </View>
  );
}


function HomeNav({navigation}) {
  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Overview' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailsScreen}
          options={{ title: 'Overview' }}
        />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

function HUHU({navigation}) {
  return (
    <View style={{ flex: 1, alignItems:'center', justifyContent: 'center' }}>
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
       style={{alignItems:'center', justifyContent: 'center', padding: 10, backgroundColor:'green'}}>
        <Text>AHUHU</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export function TestScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator  screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Text>HUHUU</Text>;
          },
          
        })}
        
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeNav} />
        <Tab.Screen name="Settings" component={HUHU} />
        <Tab.Screen name="About" component={HUHU} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
 

