import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AppRouter} from '../AppRouter';
//moduns
import AsyncStorage from '@react-native-async-storage/async-storage';
//screens
import {CourseNav} from '../../view/course';
import {ListExercise} from '../../view/course/listExercise';
import {TabHeader} from '../../view/course/Tab';
import {ChuDeNav} from '../../view/chuDe';
import {User} from '../../view/user';
import {TeacherScreen} from '../../view/home/homeScreen/teacher-screen';
import {StudentScreen} from '../../view/home/homeScreen/student-screen';
import {StudentTestList} from '../../view/home/homeScreen/student-screen/StudentSubView/studentListTest';
import {Loading} from '../../view/loading';
import {LopHocPhanNav} from '../../view/lopHocPhan';
import {LopHocPhanSV} from '../../view/home/homeScreen/student-screen/StudentSubView/LopHocPhanSV';
import {TestScreen} from '../../view/home/homeScreen/student-screen/StudentSubView/test-screen';
import {KiemTraNav} from '../../view/kiemTra';
<<<<<<< HEAD
import {DemoView} from '../../view/until/demo-view';
=======
import {TeacherControl} from '../../view/teacherControl';

>>>>>>> upstream/baochau
const Stack = createStackNavigator();

const HomeNavigator = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');

  useEffect(async () => {
    setLoading(true);
    await getAccount();
    //loadOption;
  }, []);
  const loadOption = async () => {
    setLoading(true);
    getAccount();
    await new Promise(a => setTimeout(a, 500));
  };

  useEffect(async () => {
    if (user !== '') {
      if (user[0]?.MaSV != undefined) setIsTeacher(false);
    }
    await new Promise(a => setTimeout(a, 1000));
    setLoading(false);
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

  return loading ? (
    <Stack.Screen
      name={AppRouter.LOADING}
      options={{title: AppRouter.LOADING, headerShown: false}}
      component={Loading}
    />
  ) : isTeacher ? (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRouter.TEACHER_SCREEN}
        component={TeacherScreen}
        options={{title: AppRouter.HOME, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.COURSE}
        component={CourseNav}
        options={{title: AppRouter.COURSE, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.ALLEXERCISE}
        component={ListExercise}
        options={{title: AppRouter.ALLEXERCISE, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.TAB}
        component={TabHeader}
        options={{title: AppRouter.TAB, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.USER}
        component={User}
        options={{title: AppRouter.USER, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.LISTCD}
        component={ChuDeNav}
        options={{title: AppRouter.LISTCD, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.LISTLHP}
        component={LopHocPhanNav}
        options={{title: AppRouter.LISTLHP, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.KIEMTRA}
        component={KiemTraNav}
        options={{title: AppRouter.KIEMTRA, headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRouter.STUDENT_SCREEN}
        component={StudentScreen}
        options={{title: AppRouter.HOME, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.STUDENT_LIST_TEST}
        component={StudentTestList}
        options={{title: AppRouter.STUDENT_LIST_TEST, headerShown: false}}
      />
      <Stack.Screen
        name={AppRouter.LOP_HOC_PHAN}
        component={LopHocPhanSV}
        options={{title: AppRouter.LOP_HOC_PHAN, headerShown: false}}
      />
      {/* <Stack.Screen
        name={AppRouter.TESTING}
        component={TestScreen}
        options={{title: AppRouter.TESTING, headerShown: false}}
      /> */}
      {/* <Stack.Screen
        name={AppRouter.DEMO_VIEW}
        component={DemoView}
        options={{title: AppRouter.DEMO_VIEW, headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
