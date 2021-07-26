import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
  AppState,
} from 'react-native';
//Screens
//Moduns
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {Icon, Item} from 'native-base';
import CountDown from 'react-native-countdown-component';
import io from 'socket.io-client/dist/socket.io.js';
//others
import {settings} from '../../../../../../config';
import {appBar, body, navigator, styles, pauseModal} from './styles';
import {AppRouter} from '../../../../../../navigation/AppRouter';
import {MenuQuestionModal} from '../modals/MenuQuestionModal';
//APIs
import {JointTest} from '../../../../../../../server/JointTest';
import {UpdateQuestion} from '../../../../../../../server/JointTest/update-answer';

export function TestScreen({navigation, route}) {
  const fo = useIsFocused();
  //Socket
  const socket = io(settings.NodeJsServer, {autoConnect: false});
  const [isRunning, setIsRunning] = useState(true);
  const [isShowMenuQuest, setIsShowMenuQuest] = useState(false);
  const [testData, setTestData] = useState('');

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      socket.connect();
      requestJoinTest(data.MaSV, data.MaBaiKT, data.TenSV);
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
    if (appState.current === 'background') {
      // Connect to server
      socket.emit('client-get-userquanlity', 'ouut');
      socket.disconnect();
    }
  };

  socket.on('server-set-time', function (isStart) {
    console.log('server-set-time ', isStart);
    setIsRunning(isStart);
    //socket.off('server-set-time');
  });

  socket.on('server-report-failed', function (data) {
    console.log(data);
    //socket.off();
  });

  socket.on('server-report-joined', function (data) {
    console.log(data);

    //socket.off();
  });
  //Consts
  const data = route.params?.data;
  const [currentQuestion, setCurrentQuestion] = useState('');

  //color answers
  const [colorAnswerA, setColorAnswerA] = useState(settings.colors.colorGreen);
  const [colorAnswerB, setColorAnswerB] = useState(settings.colors.colorGreen);
  const [colorAnswerC, setColorAnswerC] = useState(settings.colors.colorGreen);
  const [colorAnswerD, setColorAnswerD] = useState(settings.colors.colorGreen);

  let questionQuantity = testData?.length;
  let demoData = [
    {
      STT: 123,
      DapAn: 'A',
      DASV: 'C',
    },
    {
      STT: 3,
      DapAn: 'A',
      DASV: 'A',
    },
    {
      STT: 13,
      DapAn: 'A',
      DASV: 'A',
    },
    {
      STT: 93,
      DapAn: 'A',
      DASV: 'C',
    },
  ];

  useEffect(() => {
    if (fo) {
      if (testData == '' || testData == undefined) {
        // Connect to server
        socket.disconnect();
        socket.connect();
        getListQuestion(data.MaSV, data.MaBaiKT);
        //requestJoinTest(data.MaSV, data.MaBaiKT, data.TenSV);
        console.log('Nav route data: ', data);
      }
      try {
        console.log('QUESTION_ID: ', QUESTION_ID);
        setCurrentQuestion(testData[QUESTION_ID - 1]);
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
    if (currentQuestion?.DASV == 'A') {
      console.log('currentQuestion?.Dachon == A');
      setColorAnswerA(settings.colors.colorMain);
    } else if (currentQuestion?.DASV == 'B') {
      console.log('currentQuestion?.Dachon == B');
      setColorAnswerA(settings.colors.colorGreen);
      setColorAnswerB(settings.colors.colorMain);
    } else if (currentQuestion?.DASV == 'C') {
      console.log('currentQuestion?.Dachon == C');
      setColorAnswerC(settings.colors.colorMain);
    } else if (currentQuestion?.DASV == 'D') {
      console.log('currentQuestion?.Dachon == D');
      setColorAnswerD(settings.colors.colorMain);
    }

    //updateListData(currentQuestion, currentQuestion.STT - 1);
  }, [currentQuestion]);
  //
  function requestJoinTest(MaSV, MaBaiKT, TenSV) {
    socket.emit('client-join-test', {
      MaSV: MaSV,
      MaBaiKT: MaBaiKT,
      TenSV: TenSV,
    });
  }
  //
  function updateListData(item, index) {
    let newArr = testData;
    newArr[index] = item;
    setTestData(newArr);
    console.log(testData);
  }
  //func
  function initSocket(__bool) {
    if (__bool) {
      if (!socket) {
        socket = io.connect('http://xxx.xxx.xxx.xxx:8081', {secure: false});
        socket.on('connect', function () {
          console.log('connected');
        });
        socket.on('disconnect', function () {
          console.log('disconnected');
        });
      } else {
        socket.socket.connect(); // Yep, socket.socket ( 2 times )
      }
    } else {
      socket.disconnect();
      // socket = null; <<< We don't need this anymore
    }
  }
  //
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
    setIsShowMenuQuest(true);
  }
  const getListQuestion = async (MaSV, MaBaiKT) => {
    let rs = await JointTest(MaSV, MaBaiKT);
    setTestData(rs.data);
  };
  //
  const pressingAnswer = answer => {
    setColorAnswerA(settings.colors.colorGreen);
    setColorAnswerB(settings.colors.colorGreen);
    setColorAnswerC(settings.colors.colorGreen);
    setColorAnswerD(settings.colors.colorGreen);
    let A = 'A',
      B = 'B',
      C = 'C',
      D = 'D',
      X = 'X';
    let newAnswer = currentQuestion;
    switch (answer) {
      case A: {
        if (currentQuestion.DASV === X || currentQuestion.DASV !== A) {
          //Update
          setColorAnswerA(settings.colors.colorMain); // Set ui
          changeAnwer(A); // Set server
          newAnswer.DASV = A; // Set local
          updateQuestion(true); // Next question
        } else {
          //Cancel
          setColorAnswerA(settings.colors.colorGreen);
          changeAnwer(X);
          newAnswer.DASV = X;
        }
        break;
      }
      case B: {
        if (currentQuestion.DASV === X || currentQuestion.DASV !== B) {
          //Update
          setColorAnswerB(settings.colors.colorMain);
          changeAnwer(B);
          newAnswer.DASV = B;
          updateQuestion(true); // Next question
        } else {
          //Cancel
          setColorAnswerB(settings.colors.colorGreen);
          changeAnwer(X);
          newAnswer.DASV = X;
        }
        break;
      }
      case C: {
        if (currentQuestion.DASV === X || currentQuestion.DASV !== C) {
          //Update
          setColorAnswerC(settings.colors.colorMain);
          changeAnwer(C);
          newAnswer.DASV = C;
          updateQuestion(true); // Next question
        } else {
          //Cancel
          setColorAnswerC(settings.colors.colorGreen);
          changeAnwer(X);
          newAnswer.DASV = X;
        }
        break;
      }
      case D: {
        if (currentQuestion.DASV === X || currentQuestion.DASV !== D) {
          //Update
          setColorAnswerD(settings.colors.colorMain);
          changeAnwer(D);
          newAnswer.DASV = D;
          updateQuestion(true); // Next question
        } else {
          //Cancel
          setColorAnswerD(settings.colors.colorGreen);
          changeAnwer(X);
          newAnswer.DASV = X;
        }
        break;
      }
      default:
    }
  };
  //
  async function changeAnwer(DapAn) {
    let res = await UpdateQuestion(data.MaSV, currentQuestion.MaCH, DapAn);
    console.log(res.status, res.content);
  }
  //
  function pressHandleQuestItem(item) {
    // Nhan gia tri tu menu
    setCurrentQuestion(testData[item - 1]);
  }
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
      <MenuQuestionModal
        isVisible={isShowMenuQuest}
        close={() => setIsShowMenuQuest(false)}
        data={testData}
        menuHandle={pressHandleQuestItem}
      />
      <View style={styles.container}>
        <View style={appBar.container}>
          <TouchableOpacity
            onPress={() => {
              {
                socket.disconnect();
                navigation.goBack();
              } // Quay về màn hình trước
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
              onPress={() => pressingAnswer('A')}
              style={[body.answer, {backgroundColor: colorAnswerA}]}>
              <Text style={body.answerText}>{currentQuestion?.A}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressingAnswer('B')}
              style={[body.answer, {backgroundColor: colorAnswerB}]}>
              <Text style={body.answerText}>{currentQuestion?.B}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressingAnswer('C')}
              style={[body.answer, {backgroundColor: colorAnswerC}]}>
              <Text style={body.answerText}>{currentQuestion?.C}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressingAnswer('D')}
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
