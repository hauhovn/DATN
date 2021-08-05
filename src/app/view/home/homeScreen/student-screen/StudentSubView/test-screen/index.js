import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Modal,
    Image,
    AppState,
    Alert,
} from 'react-native';
//Screens
//Moduns
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'native-base';
import CountDown from 'react-native-countdown-component';
//others
import { settings } from '../../../../../../config';
import { appBar, body, navigator, styles, pauseModal } from './styles';
import { AppRouter } from '../../../../../../navigation/AppRouter';
import { MenuQuestionModal } from '../modals/MenuQuestionModal';
import { WaitingTestModal } from '../modals/WaitingTestModal';
//APIs
import { JointTest } from '../../../../../../../server/JointTest';
import { UpdateQuestion } from '../../../../../../../server/JointTest/update-answer';
import { getTestStatus } from '../../../../../../../server/BaiKiemTra/get-status'
import {
    serverStartTest,
    inittiateSocket,
    requestServerLogs,
    disconnectSocket,
    teacherEditTest
} from '../../../../../../../server/SocketIO'

export function TestScreen({ navigation, route }) {

    //Consts
    const data = route.params?.data;
    const [currentQuestion, setCurrentQuestion] = useState('');

    //color answers
    const [colorAnswerA, setColorAnswerA] = useState(settings.colors.colorGreen);
    const [colorAnswerB, setColorAnswerB] = useState(settings.colors.colorGreen);
    const [colorAnswerC, setColorAnswerC] = useState(settings.colors.colorGreen);
    const [colorAnswerD, setColorAnswerD] = useState(settings.colors.colorGreen);

    // Focus
    const fo = useIsFocused();
    const [isRunning, setIsRunning] = useState(true);
    const [isShowMenuQuest, setIsShowMenuQuest] = useState(false);
    const [waiting, setWaiting] = useState(true);
    const [testData, setTestData] = useState('');
    const [testStatus, setTestStatus] = useState(1);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    // Report background state
    const _handleAppStateChange = nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            // TODO: reconnect in here
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
        if (appState.current === 'background') {
            // TODO: disconnect in here
        }
    };

    // Get lenght test
    let questionQuantity = testData?.length;

    //----------------------------------EFFECTs----------------------------------

    // SOCKET
    React.useEffect(() => {
        let _data = {
            id: data.MaSV,
            room: data.MaBaiKT,
            name: data.TenSV,
            is_teacher: false,
            socket_id: '',
        };
        // Out temp connect
        disconnectSocket();


        checkTest(_data.id, _data.room);

        if (testStatus == 1) {
            // Connect and join room
            inittiateSocket(data.MaBaiKT, _data, 'Đã vào phòng chờ', 1);

            // On request
            serverStartTest((err, data) => {
                if (err) return;

                console.log('Đã vào phòng chờ ne');
                setWaiting(false);
                setIsRunning(data);
                console.log('tus = 1 ne: data= ', data);

            });

            // Check if teacher cancel test
            teacherEditTest((err, data) => {
                if (err) return;
                console.log(`gv da lam cai nay --------: `, data);
                if (data) {
                    Alert.alert('Thông báo', `Bài kiểm tra này đã bị hủy bỏ`);
                    navigation.goBack();
                }
            });
        } else if (testStatus == 2) {

            inittiateSocket(data.MaBaiKT, _data, 'Đã vào trễ', 2);
            serverStartTest((err, data) => {
                if (err) return;
                console.log('Đã vào trễ ne');
                setWaiting(false);
                setIsRunning(data);
                console.log('tus = 2 ne: data= ', data);
            });
            // Check if teacher cancel test
            teacherEditTest((err, data) => {
                if (err) return;
                console.log(`gv da lam cai nay --------: `, data);

                if (data) {
                    Alert.alert('Thông báo', `Bài kiểm tra này đã bị hủy bỏ`);
                    navigation.goBack();
                }
            });
        } else
            console.log('Đéo thèm vào');
    }, []);

    // Check background
    useEffect(() => {
        // Check on background
        AppState.addEventListener('change', _handleAppStateChange);
        return () => AppState.removeEventListener('change', _handleAppStateChange);

    }, []);

    // When comback from menu test
    useEffect(() => {
        if (fo) {
            if (testData == '' || testData == undefined) {
                getListQuestion(data?.MaSV, data?.MaBaiKT);
                //requestJoinTest(data.MaSV, data.MaBaiKT, data.TenSV);
                console.log('Nav route data: ', data);
            }
            try {
                console.log('QUESTION_ID: ', QUESTION_ID);
                setCurrentQuestion(testData[QUESTION_ID - 1]);
            } catch (error) { }
        }
    }, [fo]);

    // Change state when testData change
    useEffect(() => {
        if (testData !== '' && testData.length > 0) {
            if (testData[0] != undefined && testData[0] != null)
                setCurrentQuestion(testData[0]);
            console.log('# List quests: ', testData);
        }
    }, [testData]);

    //Set current
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

    //----------------------------------GET API DATA----------------------------------

    // Joint test
    const getListQuestion = async (MaSV, MaBaiKT) => {
        let rs = await JointTest(MaSV, MaBaiKT);
        setTestData(rs.data);
    };

    // Update answer
    async function changeAnwer(DapAn) {
        let res = await UpdateQuestion(data.MaSV, currentQuestion.MaCH, DapAn);
        console.log(res.status, res.content);
    }

    // Check test status
    async function checkTest(MaSV, MaBaiKT) {
        let res = await getTestStatus(MaSV, MaBaiKT);
        setTestData(res.status);
    }

    //----------------------------------FUNCTIONs----------------------------------

    function updateListData(item, index) {
        let newArr = testData;
        newArr[index] = item;
        setTestData(newArr);
        console.log(testData);
    }

    //  Press button next or rev
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
        } catch (error) { }
    };

    // Open menu question
    function openMenuQuestion() {
        setIsShowMenuQuest(true);
    }

    // Press answer
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

    // Press item in menu test
    function pressHandleQuestItem(item) {
        // Nhan gia tri tu menu
        setCurrentQuestion(testData[item - 1]);
    }

    // Test func
    function _test_() {
        requestServerLogs();
    }

    // Renders
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WaitingTestModal isVisible={waiting} navigation={navigation} />
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
                                // TODO: disconnect
                                navigation.navigate(AppRouter.MAIN, { screen: AppRouter.TAB });
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
                        onFinish={() => { }}
                        digitStyle={{
                            backgroundColor: 'rgba(76, 175, 80,0)',
                            borderWidth: 0,
                            borderColor: 'blue',
                        }}
                        digitTxtStyle={{ color: settings.colors.colorMain }}
                        timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                        separatorStyle={{ color: settings.colors.colorMain }} // mau` dau :
                        timeToShow={['H', 'M', 'S']}
                        timeLabels={{ m: null, s: null }}
                        showSeparator
                    />
                    <TouchableOpacity onPress={() => _test_()} style={appBar.rightButton}>
                        <Icon
                            type="Ionicons"
                            name={'ios-checkmark-done'}
                            style={{ ...appBar.buttonIcon, marginRight: 20 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={body.container}>
                    <View style={body.title}>
                        <Text style={appBar.textTitle}>Câu: {currentQuestion?.STT}</Text>
                        <TouchableOpacity
                            style={{ paddingRight: 15 }}
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
                            style={[body.answer, { backgroundColor: colorAnswerA }]}>
                            <Text style={body.answerText}>{currentQuestion?.A}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => pressingAnswer('B')}
                            style={[body.answer, { backgroundColor: colorAnswerB }]}>
                            <Text style={body.answerText}>{currentQuestion?.B}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => pressingAnswer('C')}
                            style={[body.answer, { backgroundColor: colorAnswerC }]}>
                            <Text style={body.answerText}>{currentQuestion?.C}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => pressingAnswer('D')}
                            style={[body.answer, { backgroundColor: colorAnswerD }]}>
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
