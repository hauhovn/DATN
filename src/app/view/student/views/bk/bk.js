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
    BackHandler,
    Switch
} from 'react-native';
//Screens
//Moduns
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'native-base';
//others
import { settings } from '../../../../config';
import { appBar, body, navigator, styles, pauseModal } from './styles';
import { AppRouter } from '../../../../navigation/AppRouter';
//APIs
import { JointTest } from '../../../../../server/JointTest';
import { UpdateQuestion } from '../../../../../server/JointTest/update-answer';
import { getTestStatus } from '../../../../../server/BaiKiemTra/get-status'
import {
    serverStartTest,
    inittiateSocket,
    requestServerLogs,
    disconnectSocket,
    teacherEditTest
} from '../../../../../server/SocketIO'

// Components
import {
    WaitingTestModal,
    MenuQuestionModal,
    MyCountDown
} from '../../components';

// Constants
import { COLORS, GIFS, SIZES, STYLES } from '../../../../assets/constants'

// Components
import { MyAlert } from '../../components';

export default TestScreen;
function TestScreen({ navigation, route }) {


    //Consts
    const data = route.params?.data;
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [sendQuestion, setSendQuestion] = useState('');
    let _data = {
        id: data?.MaSV,
        room: data?.MaBaiKT,
        name: data?.TenSV,
        is_teacher: false,
        socket_id: '',
    };

    //color answers
    const [colorAnswerA, setColorAnswerA] = useState(settings.colors.colorGreen);
    const [colorAnswerB, setColorAnswerB] = useState(settings.colors.colorGreen);
    const [colorAnswerC, setColorAnswerC] = useState(settings.colors.colorGreen);
    const [colorAnswerD, setColorAnswerD] = useState(settings.colors.colorGreen);

    // Focus
    const fo = useIsFocused();
    const [isRuning, setisRuning] = useState(true); // Testing
    const [isShowMenuQuest, setIsShowMenuQuest] = useState(false); // Open list question
    const [waiting, setWaiting] = useState(true); // When teacher stop test
    const [autoNext, setAutoNext] = useState(true); // Auto next question after answer
    const [showResult, setShowResult] = useState(false); // If end test or . . .

    const [testData, setTestData] = useState(''); // Data
    const [testStatus, setTestStatus] = useState(0); // Test status
    ``
    const appState = useRef(AppState.currentState); // Get app state
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    // Report background state
    const _handleAppStateChange = nextAppState => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            // Reconnect
            inittiateSocket(data?.MaBaiKT, _data, 'Đã quay trở lại', 2);
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
        if (appState.current === 'background') {
            disconnectSocket();
        }
    };

    // Get lenght test
    let questionQuantity = testData?.length;

    //----------------------------------EFFECTs----------------------------------

    // SOCKET
    useEffect(() => {

        // Kill temp connect
        disconnectSocket();

        checkTest(_data.id, _data.room);

        // If can not get test status
        if (testStatus == 0) return;

        if (testStatus == 1) {
            // Connect and join room
            inittiateSocket(data?.MaBaiKT, _data, 'Đã vào phòng chờ', 1);
            console.log('RUN ! LAN');

            // On request
            serverStartTest((err, data) => {
                if (err) return;
                console.log('Đã vào phòng chờ ne');
                setWaiting(false);
                setisRuning(data);

            });

            // Check if teacher cancel test
            teacherEditTest((err, data) => {
                if (err) return;
                if (data) {
                    Alert.alert('Thông báo', `Bài kiểm tra này đã bị hủy bỏ`);
                    navigation.goBack();
                }
            });
        } else if (testStatus == 2) {

            inittiateSocket(data.MaBaiKT, _data, 'Đã vào trễ', 2);
            setWaiting(false);
            serverStartTest((err, data) => {
                if (err) return;
                console.log('Đã vào trễ ne');
                setWaiting(false);
                setisRuning(data);
            });
            // Check if teacher cancel test
            teacherEditTest((err, data) => {
                if (err) return;
                if (data) {
                    Alert.alert('Thông báo', `Bài kiểm tra này đã bị hủy bỏ`);
                    navigation.goBack();
                }
            });
        } else if (testStatus > 2) {
            setWaiting(false)

        }

    }, [testStatus]);

    // Check background
    useEffect(() => {
        // Check on background
        AppState.addEventListener('change', _handleAppStateChange);
        return () => AppState.removeEventListener('change', _handleAppStateChange);

    }, []);

    // Go back
    const checkAndGoBack = (ísBack) => {
        Alert.alert("Bạn có chắc", "Thoát khỏi bài kiểm tra này?", [
            {
                text: "Trở lại",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Đồng ý",
                onPress: () => {
                    disconnectSocket();
                    if (ísBack) { navigation.goBack() }
                }
            }
        ]);
    }

    // Check back boutton
    useEffect(() => {
        const backAction = () => {

            checkAndGoBack(true);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
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

        let temp = new Object({ DapAn: currentQuestion.DASV, MaCH: currentQuestion.MaCH });
        setSendQuestion(temp);

    }, [currentQuestion]);

    //----------------------------------GET API DATA----------------------------------

    // Joint test
    const getListQuestion = async (MaSV, MaBaiKT) => {
        let rs = await JointTest(MaSV, MaBaiKT);

        rs.data.forEach(function (element) {
            element.DapAnDung = "non";
        });
        setTestData(rs?.data);
    };

    // Update answer
    async function changeAnwer(DapAn) {
        let res = await UpdateQuestion(data.MaSV, currentQuestion.MaCH, DapAn);
        console.log(res.status, res.content);
    }

    // Check test status
    async function checkTest(MaSV, MaBaiKT) {
        let res = await getTestStatus(MaSV, MaBaiKT);
        setTestStatus(res.status);
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

        console.log(sendQuestion);
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
        console.log('ru-ren', currentQuestion);
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
                    newAnswer.DASV = A; // Set local
                    if (autoNext) updateQuestion(true); // Next question
                } else {
                    //Cancel
                    setColorAnswerA(settings.colors.colorGreen);
                    newAnswer.DASV = X;
                }
                break;
            }
            case B: {
                if (currentQuestion.DASV === X || currentQuestion.DASV !== B) {
                    //Update
                    setColorAnswerB(settings.colors.colorMain);
                    newAnswer.DASV = B;
                    if (autoNext) updateQuestion(true); // Next question
                } else {
                    //Cancel
                    setColorAnswerB(settings.colors.colorGreen);
                    newAnswer.DASV = X;
                }
                break;
            }
            case C: {
                if (currentQuestion.DASV === X || currentQuestion.DASV !== C) {
                    //Update
                    setColorAnswerC(settings.colors.colorMain);
                    newAnswer.DASV = C;
                    if (autoNext) updateQuestion(true); // Next question
                } else {
                    //Cancel
                    setColorAnswerC(settings.colors.colorGreen);
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
                    if (autoNext) if (autoNext) updateQuestion(true); // Next question
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

        newAnswer.sended = false;
        setCurrentQuestion(newAnswer);
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

    // footer render
    function renderFooter() {
        return (
            <View style={{
                ...navigator.container,
                height: 42,
                alignSelf: 'center',
                justifyContent: 'space-around',
                paddingHorizontal: SIZES.radius,
                borderTopLeftRadius: SIZES.radius,
                borderTopRightRadius: SIZES.radius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                elevation: 6,
                backgroundColor: COLORS.white
            }}>
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
                <Text style={{ ...navigator.text, paddingHorizontal: SIZES.radius, fontSize: 18 }}>
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
        );
    }

    // tabar render
    function renderTabar() {
        return (
            <View style={{
                ...appBar.container,
                height: 64,
                marginHorizontal: SIZES.radius / 2,
                borderBottomLeftRadius: SIZES.radius,
                borderBottomRightRadius: SIZES.radius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                elevation: 6,
                backgroundColor: COLORS.white
            }}>
                <TouchableOpacity
                    onPress={async () => {
                        {
                            // Quay về màn hình trước
                            checkAndGoBack(true);
                        }
                    }}
                    style={appBar.leftButton}>
                    <Icon
                        type="MaterialIcons"
                        name="keyboard-arrow-left"
                        style={appBar.buttonIcon}
                    />
                </TouchableOpacity>

                {/** Countdown */}
                <MyCountDown title={'\t\t'} time={1200} isRuning={isRuning} />


                <TouchableOpacity
                    onPress={() => Alert.alert("Bạn có chắc", "Thoát 123 khỏi bài kiểm tra này?", [
                        {
                            text: "Trở lại",
                            onPress: () => null,
                            style: "cancel"
                        },
                        {
                            text: "Đồng ý",
                            onPress: () => {
                                disconnectSocket();
                                navigation.navigate(AppRouter.TEST_RESULT)
                            }
                        }
                    ])}
                    style={appBar.rightButton}>
                    <Icon
                        type="Ionicons"
                        name={'ios-checkmark-done'}
                        style={{ ...appBar.buttonIcon, }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    // Pause test modal
    function renderPauseTest() {
        return (
            <Modal animationType={'fade'} transparent={true} visible={!isRuning}>
                <View style={pauseModal.container}>
                    <View style={pauseModal.box}>
                        <Image
                            style={pauseModal.gif}
                            source={GIFS.loading_cat}
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
        );
    }

    // Renders
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <WaitingTestModal isVisible={waiting} navigation={navigation} />

            <View style={styles.container}>

                {/** Tabar */}
                {renderTabar()}

                <View style={body.container}>

                    {/** Number quest*/}
                    <View style={body.title}>
                        <Text style={appBar.textTitle}>
                            {currentQuestion?.STT}</Text>

                        {/** Button open quest picker */}
                        <TouchableOpacity
                            style={{ paddingRight: 15 }}
                            onPress={() => openMenuQuestion()}>
                            <Icon
                                type="AntDesign"
                                name={'menufold'}
                                style={{ ...appBar.buttonIcon, fontSize: 26 }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/** Question */}
                    <View style={body.question}>
                        <ScrollView style={{ marginHorizontal: SIZES.radius, borderRadius: SIZES.base, ...STYLES.shadow, }}>
                            <Text style={{ ...body.questionText, padding: SIZES.base, textAlign: 'auto' }}>
                                {'\t\t\t'}
                                {currentQuestion?.CauHoi}
                                {'\t'}- buổi phỏng vấn với talkSports, trung vệ Jose Fonte bày tỏ cảm nghĩ về sự kiện Lionel Messi đầu quân cho PSG: "Tôi thấy rất vui. Tôi thật sự bất ngờ khi hay tin một siêu sao như Lionel Messi đã đến Ligue 1. Điều này thực sự thú vị. Rõ ràng chúng tôi sẽ gặp nhiều khó khăn khi đối mặt với cậu ấy nhưng chúng tôi đều đã sẵn sàng
                                g buổi phỏng vấn với talkSports, trung vệ Jose Fonte bày tỏ cảm nghĩ về sự kiện Lionel Messi đầu quân cho PSG: "Tôi thấy rất vui. Tôi thật sự bất ngờ khi hay tin một siêu sao như Lionel Messi đã đến Ligue 1. Điều này thực sự thú vị. Rõ ràng chúng tôi sẽ gặp nhiều khó khăn khi đối mặt với cậu ấy nhưng chúng tôi đều đã sẵn sàng

                            </Text>
                        </ScrollView>

                        {/** Switch auto next */}
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row', alignSelf: 'flex-end',
                            paddingVertical: SIZES.radius / 3,
                            backgroundColor: COLORS.white,
                            paddingRight: SIZES.radius,
                        }}>
                            <Text style={{ opacity: autoNext ? 1 : 0 }}>Next </Text>
                            <Switch
                                trackColor={{ false: COLORS.grayScale, true: COLORS.orangeLight }}
                                thumbColor={autoNext ? COLORS.orangeDark : COLORS.darkGray}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setAutoNext}
                                value={autoNext}
                            />
                        </View>

                        {/** Buttons answer */}
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

                {/** Next - Revert */}
                {renderFooter()}

            </View>

            {/** Question Picker */}
            <MenuQuestionModal
                isVisible={isShowMenuQuest}
                close={() => setIsShowMenuQuest(false)}
                data={testData}
                menuHandle={pressHandleQuestItem}
            />

            {/** Pause test modal */}
            {renderPauseTest()}

        </SafeAreaView>
    );
}
