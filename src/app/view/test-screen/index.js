import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
//Screens
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//Moduns
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Icon} from 'native-base';
import CountDown from 'react-native-countdown-component';
import io from 'socket.io-client/dist/socket.io.js';
import {TestingTimeCountDown} from '../../components/time-remote/time-countdown';
//others
import {settings} from '../../config';
import {appBar, body, navigator, styles} from './styles';
import {AppRouter} from '../../navigation/AppRouter';
import {testData} from './test-data';

export function TestScreen({navigation, route}) {
  const fo = useIsFocused();
  //Socket
  let socket = ('https://da-tot-nghiep.herokuapp.com/', {jsonp: false});
  //Consts
  const [currentQuestion, setCurrentQuestion] = useState(testData[0]);
  const QUESTION_ID = route.params;
  const timeTestRef = useRef(null);
  //color answers
  const [colorAnswerA, setColorAnswerA] = useState(settings.colors.colorGreen);
  const [colorAnswerB, setColorAnswerB] = useState(settings.colors.colorGreen);
  const [colorAnswerC, setColorAnswerC] = useState(settings.colors.colorGreen);
  const [colorAnswerD, setColorAnswerD] = useState(settings.colors.colorGreen);

  let questionQuantity = testData.length;

  useEffect(() => {
    if (fo) {
      try {
        console.log('QUESTION_ID: ', QUESTION_ID);
        setCurrentQuestion(testData[QUESTION_ID.QUESTION_ID - 1]);
      } catch (error) {}
    }
  }, [fo]);

  useEffect(() => {
    setColorAnswerA(settings.colors.colorGreen);
    setColorAnswerB(settings.colors.colorGreen);
    setColorAnswerC(settings.colors.colorGreen);
    setColorAnswerD(settings.colors.colorGreen);
    //set answers
    if (currentQuestion.dachon == 'A') {
      console.log('currentQuestion.dachon == A');
      setColorAnswerA(settings.colors.colorMain);
    } else if (currentQuestion.dachon == 'B') {
      console.log('currentQuestion.dachon == B');
      setColorAnswerA(settings.colors.colorGreen);
      setColorAnswerB(settings.colors.colorMain);
    } else if (currentQuestion.dachon == 'C') {
      console.log('currentQuestion.dachon == C');
      setColorAnswerC(settings.colors.colorMain);
    } else if (currentQuestion.dachon == 'D') {
      console.log('currentQuestion.dachon == D');
      setColorAnswerD(settings.colors.colorMain);
    }
    //
  }, [currentQuestion]);

  //func
  const updateQuestion = next => {
    try {
      if (isTesting()) {
        let num = parseInt(currentQuestion.stt);
        if (next) {
          if (num == testData.length) setCurrentQuestion(testData[0]);
          else setCurrentQuestion(testData[parseInt(currentQuestion.stt)]);
        } else {
          if (num == 1) {
            setCurrentQuestion(testData[testData.length - 1]);
          } else setCurrentQuestion(testData[num - 2]);
        }
      } else {
        console.log('Time stoped!');
        Alert.alert('Time stoped!');
      }
    } catch (error) {}
  };

  const isTesting = () => {
    try {
      let status = true;
      status = timeTestRef.current.getTimeStatus();
      console.log('getTimeTestStatus @1: ', status);
      return status;
    } catch (error) {
      console.log('TestScreen / getTimeTestStatus: ', error);
    }
  };
  //
  function openMenuQuestion() {
    if (isTesting()) navigation.navigate(AppRouter.MENU_QUESTION);
    else {
      Alert.alert('Time stoped! ok ok ');
    }
  }
  //
  const pressingAnswer = answer => {
    if (isTesting()) {
      setColorAnswerA(settings.colors.colorGreen);
      setColorAnswerB(settings.colors.colorGreen);
      setColorAnswerC(settings.colors.colorGreen);
      setColorAnswerD(settings.colors.colorGreen);
      switch (answer) {
        case 'A': {
          setColorAnswerA(settings.colors.colorMain);
          break;
        }
        case 'B': {
          setColorAnswerB(settings.colors.colorMain);
          break;
        }
        case 'C': {
          setColorAnswerC(settings.colors.colorMain);
          break;
        }
        case 'D': {
          setColorAnswerD(settings.colors.colorMain);
          break;
        }
        default:
      }
    } else {
      Alert.alert('Time stoped! OK');
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={appBar.container}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack(); // Quay về màn hình trước
            }}
            style={appBar.leftButton}>
            <Icon
              type="MaterialIcons"
              name="keyboard-arrow-left"
              style={appBar.buttonIcon}
            />
          </TouchableOpacity>
          <Text style={appBar.textTitle}>THỜI GIAN</Text>
          <TestingTimeCountDown ref={timeTestRef} />
          <TouchableOpacity onPress={() => {}} style={appBar.rightButton}>
            <Icon
              type="Ionicons"
              name={'ios-checkmark-done'}
              style={appBar.buttonIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={body.container}>
          <View style={body.title}>
            <Text style={appBar.textTitle}>Câu: {currentQuestion.stt}</Text>
            <TouchableOpacity
              style={{paddingRight: 15}}
              onPress={() => openMenuQuestion()}>
              <Icon
                type="MaterialCommunityIcons"
                name={'microsoft-xbox-controller-menu'}
                style={appBar.buttonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={body.question}>
            <ScrollView>
              <Text style={body.questionText}>
                {'\t\t'}
                {currentQuestion.cauhoi}
              </Text>
            </ScrollView>
          </View>
          <View style={body.answersContainer}>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerA != settings.colors.colorMain)
                  pressingAnswer('A');
              }}
              style={[body.answer, {backgroundColor: colorAnswerA}]}>
              <Text styles={body.answerText}>{currentQuestion.a}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerB != settings.colors.colorMain)
                  pressingAnswer('B');
              }}
              style={[body.answer, {backgroundColor: colorAnswerB}]}>
              <Text styles={body.answerText}>{currentQuestion.b}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerC != settings.colors.colorMain)
                  pressingAnswer('C');
              }}
              style={[body.answer, {backgroundColor: colorAnswerC}]}>
              <Text styles={body.answerText}>{currentQuestion.c}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerD != settings.colors.colorMain)
                  pressingAnswer('D');
              }}
              style={[body.answer, {backgroundColor: colorAnswerD}]}>
              <Text styles={body.answerText}>{currentQuestion.d}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={navigator.container}>
          <TouchableOpacity
            onPress={() => {
              updateQuestion(false);
            }}>
            <Icon
              style={navigator.icon}
              type="Ionicons"
              name="arrow-undo-circle-outline"
            />
          </TouchableOpacity>
          <Text style={navigator.text}>
            {currentQuestion.stt}/{questionQuantity}
          </Text>
          <TouchableOpacity
            onPress={() => {
              updateQuestion(true);
            }}>
            <Icon
              style={navigator.icon}
              type="Ionicons"
              name="arrow-redo-circle-outline"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
