import React, {useEffect, useState} from 'react';
import {View, LogBox} from 'react-native';
import AppNavigation from './app/navigation/AppNavigation';
import TestingNavigation from './app/navigation/TestingNavigation';

LogBox.ignoreAllLogs();
export default function App() {
  return (
    <View style={{flex: 1}}>
      <TestingNavigation />
    </View>
  );
}
