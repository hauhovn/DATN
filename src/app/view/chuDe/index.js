import React from 'react';
import {AppRouter} from '../../navigation/AppRouter';
import {createStackNavigator} from '@react-navigation/stack';
import {ListChuDe} from '../chuDe/ListChuDe';
import {CauHoi} from '../chuDe/cauHoi';
import {InfomationQuestion} from './cauHoi/infoQuest';
import {EditQuest} from './cauHoi/infoQuest/editQuest';
import {AddExercise} from './cauHoi/addExercise';
import {MonHoc} from './listMonHoc';

const Stack = createStackNavigator();

function ChuDeNav() {
  console.log('ChuDeNav');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppRouter.MONHOC}
        options={{title: AppRouter.MONHOC, headerShown: false}}
        component={MonHoc}
      />
      <Stack.Screen
        name={AppRouter.LISTCD}
        options={{headerShown: false}}
        component={ListChuDe}
      />
      <Stack.Screen
        name={AppRouter.QUESTION}
        options={{headerShown: false}}
        component={CauHoi}
      />
      <Stack.Screen
        name={AppRouter.INFO}
        options={{title: AppRouter.INFO, headerShown: false}}
        component={InfomationQuestion}
      />
      <Stack.Screen
        name={AppRouter.AddExercise}
        options={{title: AppRouter.AddExercise, headerShown: false}}
        component={AddExercise}
      />
      <Stack.Screen
        name={AppRouter.EditQuest}
        options={{title: AppRouter.AddAnswer, headerShown: false}}
        component={EditQuest}
      />
    </Stack.Navigator>
  );
}

export {ChuDeNav};
