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

  const headerY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -SCROLL_DISTANCE],
    extrapolate: 'extend',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const imageY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  // ------ nhấn item trên header
  const HeaderHandle = value => {
    console.log('HeaderHandle: ', value);
    if (value === 'Môn học') {
      nav.navigate(AppRouter.COURSE);
    }

    if (value === 'Câu hỏi') {
      nav.navigate(AppRouter.ALLEXERCISE, {
        item: 'all',
      });
    }

    if (value === 'Chủ đề') {
      nav.navigate(AppRouter.LISTCD);
    }

    if (value === 'Lớp học phần') {
      nav.navigate(AppRouter.LISTLHP);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(500).then(() => setRefreshing(false));
  }, []);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

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
