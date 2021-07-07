import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//screens
import {TeacherScreen} from './teacher-screen';
import {StudentScreen} from './student-screen';

const HomeScreen = navigation => {
  const [user, setUser] = useState('');

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (user !== '') {
      console.log('user: ', user);
    }
  }, [user]);

  //funs
  const getAccount = async () => {
    try {
      const res = await AsyncStorage.getItem('currentUser');
      setUser(JSON.parse(res));
    } catch (e) {
      // error reading value
    }
  };

  return (
    <SafeAreaView>
      {user[0]?.MaSV == undefined ? <TeacherScreen /> : <StudentScreen />}
    </SafeAreaView>
  );
};

export {HomeScreen};
