import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
//Screens
//Moduns
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Icon} from 'native-base';
import CountDown from 'react-native-countdown-component';
import io from 'socket.io-client/dist/socket.io.js';
//others
import {settings} from '../../../../../../config';
import {appBar, body, navigator, styles, pauseModal} from './styles';
import {AppRouter} from '../../../../../../navigation/AppRouter';
//import {testData} from './test-data';
import {JointTest} from '../../../../../../../server/JointTest';

export function TestScreen({navigation, route}) {
  const fo = useIsFocused();
  //Socket
  const socket = io('https://da-tot-nghiep.herokuapp.com', {jsonp: false});
  const [isRunning, setIsRunning] = useState(true);
  const [testData, setTestData] = useState('');

  socket.on('server-stop-time', function (data) {
    if (isRunning != data) {
      console.log('isRunning: ', isRunning, '& data: ', data);
      console.log('server-stop-time ', data);
      setIsRunning(data);
      socket.off('server-stop-time');
    }
  });
  //Consts
  const [listQuestion, setListQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const QUESTION_ID = route.params;

  //color answers
  const [colorAnswerA, setColorAnswerA] = useState(settings.colors.colorGreen);
  const [colorAnswerB, setColorAnswerB] = useState(settings.colors.colorGreen);
  const [colorAnswerC, setColorAnswerC] = useState(settings.colors.colorGreen);
  const [colorAnswerD, setColorAnswerD] = useState(settings.colors.colorGreen);

  let questionQuantity = testData.length;

  useEffect(() => {
    if (fo) {
      if (testData == '') {
        getListQuestion(1, 16);
      }
      try {
        console.log('QUESTION_ID: ', QUESTION_ID.QUESTION_ID);
        setCurrentQuestion(testData[QUESTION_ID.QUESTION_ID - 1]);
      } catch (error) {}
    }
  }, [fo]);

  useEffect(() => {
    if (testData !== '') {
      setCurrentQuestion(testData[0]);
      console.log('# List quests: ', testData);
    }
  }, [testData]);

  useEffect(() => {
    setColorAnswerA(settings.colors.colorGreen);
    setColorAnswerB(settings.colors.colorGreen);
    setColorAnswerC(settings.colors.colorGreen);
    setColorAnswerD(settings.colors.colorGreen);
    //set answers
    if (currentQuestion?.Dachon == 'A') {
      console.log('currentQuestion?.Dachon == A');
      setColorAnswerA(settings.colors.colorMain);
    } else if (currentQuestion?.Dachon == 'B') {
      console.log('currentQuestion?.Dachon == B');
      setColorAnswerA(settings.colors.colorGreen);
      setColorAnswerB(settings.colors.colorMain);
    } else if (currentQuestion?.Dachon == 'C') {
      console.log('currentQuestion?.Dachon == C');
      setColorAnswerC(settings.colors.colorMain);
    } else if (currentQuestion?.Dachon == 'D') {
      console.log('currentQuestion?.Dachon == D');
      setColorAnswerD(settings.colors.colorMain);
    }
  }, [currentQuestion]);

  //func
  const updateQuestion = next => {
    try {
      let num = parseInt(currentQuestion?.STT);
      if (next) {
        if (num == testData.length) setCurrentQuestion(testData[0]);
        else setCurrentQuestion(testData[parseInt(currentQuestion?.STT)]);
      } else {
        if (num == 1) {
          setCurrentQuestion(testData[testData.length - 1]);
        } else setCurrentQuestion(testData[num - 2]);
      }
    } catch (error) {}
  };

  function openMenuQuestion() {
    navigation.navigate(AppRouter.MENU_QUESTION, {data: testData});
  }
  const getListQuestion = async (MaSV, MaBaiKT) => {
    let rs = await JointTest(MaSV, MaBaiKT);
    setTestData(rs.data);
    console.log('#ahihi: ', testData);
  };
  //
  const pressingAnswer = answer => {
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
  };
  //
  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal animationType={'fade'} transparent={true} visible={!isRunning}>
        <View style={pauseModal.container}>
          <View style={pauseModal.box}>
            <Image
              style={pauseModal.gif}
              source={require('../../../../../../asset/gif/loading-cat.gif')}
            />
            <View
              style={{
                borderRadius: 60,
                width: 106,
                height: 106,
                marginTop: -150,
                marginRight: -0.8,
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                borderColor: settings.colors.colorGreen,
              }}
            />
            <Text style={pauseModal.title}>TẠM DỪNG</Text>
            <Text style={pauseModal.textContent}>
              Bài kiểm tra này đã được giám thị dừng lại!
            </Text>
          </View>
        </View>
      </Modal>
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
          <CountDown
            size={16}
            until={3600}
            running={isRunning}
            onFinish={() => {}}
            digitStyle={{
              backgroundColor: 'rgba(76, 175, 80,0)',
              borderWidth: 0,
              borderColor: 'blue',
            }}
            digitTxtStyle={{color: settings.colors.colorMain}}
            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
            separatorStyle={{color: settings.colors.colorMain}} // mau` dau :
            timeToShow={['H', 'M', 'S']}
            timeLabels={{m: null, s: null}}
            showSeparator
          />
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
            <Text style={appBar.textTitle}>Câu: {currentQuestion?.STT}</Text>
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
                {currentQuestion?.CauHoi}
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
              <Text style={body.answerText}>{currentQuestion?.A}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerB != settings.colors.colorMain)
                  pressingAnswer('B');
              }}
              style={[body.answer, {backgroundColor: colorAnswerB}]}>
              <Text style={body.answerText}>{currentQuestion?.B}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerC != settings.colors.colorMain)
                  pressingAnswer('C');
              }}
              style={[body.answer, {backgroundColor: colorAnswerC}]}>
              <Text style={body.answerText}>{currentQuestion?.C}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (colorAnswerD != settings.colors.colorMain)
                  pressingAnswer('D');
              }}
              style={[body.answer, {backgroundColor: colorAnswerD}]}>
              <Text style={body.answerText}>{currentQuestion?.D}</Text>
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
            {currentQuestion?.STT}/{questionQuantity}
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
