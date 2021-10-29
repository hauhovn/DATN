import React, { useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity,
    StyleSheet, Image, ScrollView,
    Switch, AppState, Alert
} from 'react-native';

import { Icon } from 'native-base';

// Apis
import {
    UpdateQuestion,
    JointTest,
    getTestStatus,
    getTestTimeCountdown
} from '../../../../server/student-apis'

// Socket IO
import {
    inittiateSocket,
    serverStartTest,
    disconnectSocket,
    teacherEditTest
} from '../../../../server/SocketIO'

// Components
import {
    MyAppBar, MyCountDown,
    MenuQuestionModal, LoadingIndicator,
    WaitingTest, PauseTestModal
} from '../components'

// Constants
import { SIZES, STYLES, COLORS } from '../../../assets/constants';

const TestScreen = ({ route, navigation }) => {

    const stateInfo = {
        waiting: 'Đã vào phòng chờ',
        testing: 'Đang kiểm tra',
        paused: 'Đã dừng lại',
        reconnect: 'Đã vào lại phòng'
    }
    /** Get routes MaBaiKT, MaSV, TenSV*/
    const data = route.params?.data;
    const thisStudent = {
        name: data?.TenSV,
        id: data?.MaSV
    }, thisTest = { id: data?.MaBaiKT }


    const [state, setState] = React.useState(undefined);
    const [autoNext, setAutoNext] = React.useState(true);
    const [isShowMenuQuestion, setShowMenuQuestion] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [isUpdate, setUpdate] = React.useState(false);

    const [selectedOption, setSelectedOption] = React.useState(undefined);
    const [selectedQuestion, setSelectedQuestion] = React.useState(undefined);

    const [questList, setQuestList] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(undefined);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const [timeTestCountdown, setTimeTest] = React.useState(60);

    const [isReviewMode, setReviewMode] = React.useState(true);



    React.useEffect(() => {

        /** Load option */
        LoadOption();

        /** Socket IO Listener */
        SocketIO();

        /** App state effect */
        AppStateEffect();

    }, [])

    /** After get quest list */
    React.useEffect(() => {
        /** Set default */
        setCurrentQuestion(questList[0]);

    }, [questList])

    /** After set current */
    React.useEffect(() => {
        setSelectedOption(currentQuestion?.DASV);
    }, [currentQuestion])

    /** Socket IO */
    const SocketIO = () => {
        /** Init */
        let userForSocket = {
            id: thisStudent.id,
            room: thisTest.id,
            name: thisStudent.name,
            is_teacher: false,
            socket_id: '',
        };
        disconnectSocket();

        inittiateSocket(thisTest.id, userForSocket, stateInfo.waiting, 1);

        /** Listener */

        /** Teacher start or pause test */
        serverStartTest((err, isStart) => {
            if (err) return;
            if (isStart) setState(stateInfo.testing);
            else setState(stateInfo.paused);
        });

        teacherEditTest((err, isRemove) => {
            if (err) return;
            if (isRemove) {
                navigation.goBack();
                Alert.alert(`Thông báo`, `Bài kiểm tra đã kết thúc!`)
            }


        });

    }

    /** Load option */
    const LoadOption = async () => {

        setLoading(true);

        /** Get test status */
        await getTest_Status();

        /** Get Quests List */
        await getQuestList();

        setLoading(false);
    }

    /** App state effects */
    const AppStateEffect = () => {

        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }

    /** Handle app state change */
    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            // console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);

        if (appState.current == 'active') {
            console.log(`[+] App comeback`);

            let userForSocket = {
                id: thisStudent.id,
                room: thisTest.id,
                name: thisStudent.name,
                is_teacher: false,
                socket_id: '',
            };

            /** Init */
            disconnectSocket();
            inittiateSocket(thisTest.id, userForSocket, stateInfo.reconnect, 3);
        }
        if (appState.current == 'background') {
            console.log(`[-] App in background`);

            /** Disconnect */
            disconnectSocket();
        }
    };

    /** Get test status */
    const getTest_Status = async () => {
        let response = await getTestStatus(thisStudent.id, thisTest.id);
        console.log(`res: `, response);
        switch (response?.status) {
            case '1': setState(stateInfo.waiting); setReviewMode(false); break;
            case '2': setState(stateInfo.testing); setReviewMode(false); break;
            case '3': setState(stateInfo.paused); setReviewMode(false); break;
            case '4': setState(stateInfo.testing); setReviewMode(true); break;
            default: setState(stateInfo.waiting); break;
        }
    }

    /** Get test data */
    const getQuestList = async () => {

        let response = await JointTest(thisStudent.id, thisTest.id, isReviewMode);
        await setQuestList(response?.data)

    }

    /** Update answer */
    const updateAnswer = async () => {

        if (!isUpdate) return;

        console.log(`select: ${selectedOption}, dasv: ${currentQuestion?.DASV}`);

        let response = await UpdateQuestion(thisStudent.id, selectedQuestion.MaCH, selectedOption);
        await console.log(response);

        let cpy = questList;
        let itemChange = cpy.find(i => i.MaCH == selectedQuestion.MaCH);
        let index = cpy.indexOf(itemChange);
        cpy[index].DASV = selectedOption;

        setQuestList(cpy);
        setUpdate(false);
    }

    /** Update question next, previous or complete */
    const updateQuestion = async (isNext, isComplete) => {

        await setLoading(true);
        await updateAnswer();

        if (isComplete) {

            console.log(`complete`);
            await setLoading(false);
            return;
        }
        if (isNext) {
            if (currentQuestion?.STT == questList?.length) {

                await setCurrentQuestion(questList[0])
            } else {

                await setCurrentQuestion(questList[currentQuestion.STT])
            }
        } else {
            if (currentQuestion?.STT == 1) {
                await setCurrentQuestion(questList[questList.length - 1])
            } else {
                await setCurrentQuestion(questList[currentQuestion.STT - 2])
            }
        }

        await setLoading(false);

    }

    /** Press options */
    const pressOption = (option) => {
        if (isReviewMode) {
            console.log('Current: ', currentQuestion);
            return;
        }
        else {
            selectedOption == option ? setSelectedOption('X') : setSelectedOption(option);
            setSelectedQuestion(currentQuestion);
            setUpdate(true);
        }

    }

    /** Get time contdown */
    async function getTimeCountdown() {
        let rs = await getTestTimeCountdown(thisTest.id);
        if (rs?.data != undefined) {
            const cb = parseFloat(rs.data.SoGiayLam) - parseFloat(rs.data.ThoiGianDaDienRa);
            await setTimeTest(cb);
            console.log(`Time for this test: `, cb);
            return cb;
        } else return 9999;

    }

    /**  Render*/
    function renderNavigateBar() {

        // Request load test time and convert to SEC
        getTimeCountdown();

        return (<View>
            <MyAppBar
                title={'Bài kiểm tra'}
                child={
                    state !== stateInfo.waiting
                    && (
                        !isReviewMode && <MyCountDown
                            isRuning={state == stateInfo.testing ? true : false}
                            time={timeTestCountdown}
                            onFinish={() => Alert.alert(`time up`)}
                        />
                    )}
                iconRightStyle={{ fontSize: state === stateInfo.testing ? 26 : 0 }}
                iconLeftStyle={{ fontSize: 26 }}
                rightIconType={'Ionicons'}
                rightIconName={'ios-checkmark-done'}
                rightHandle={() => updateQuestion(true, true)}
            />
        </View>)
    }

    /** Footer render */
    function renderFooter() {
        return (
            <View style={{
                ...styles.nextAndPreviousBox
            }}>
                <TouchableOpacity
                    onPress={() => {
                        updateQuestion(false);
                    }}>
                    <Icon
                        style={{
                            color: COLORS.colorMain, fontSize: 28
                        }}
                        type="Ionicons"
                        name="arrow-undo-circle-outline"
                    />
                </TouchableOpacity>
                <Text style={{
                    color: COLORS.colorMain,
                    paddingHorizontal: SIZES.radius, fontSize: 18
                }}>
                    {currentQuestion?.STT} / {questList?.length}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        updateQuestion(true);
                    }}>
                    <Icon
                        style={{
                            color: COLORS.colorMain, fontSize: 28
                        }}
                        type="Ionicons"
                        name="arrow-redo-circle-outline"
                    />
                </TouchableOpacity>
            </View>
        );
    }

    /** Quest number & open menu buton */
    function renderNumberAndMenuButton() {
        return (
            <View style={{
                justifyContent: 'space-between',
                paddingHorizontal: SIZES.padding,
                marginVertical: SIZES.radius,
                flexDirection: 'row',
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: COLORS.colorMain,
                }}>{'Câu: '}{currentQuestion?.STT}</Text>
                <TouchableOpacity
                    style={{ paddingRight: 15 }}
                    onPress={async () => {
                        setLoading(true);
                        await updateAnswer();
                        setShowMenuQuestion(!isShowMenuQuestion);
                        setLoading(false);
                    }}>
                    <Icon
                        type="AntDesign"
                        name={'menufold'}
                        style={{
                            fontSize: 26,
                            color: COLORS.colorMain,
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /** Options */
    function renderOptions() {

        const button = {
            ...STYLES.shadow,
            padding: SIZES.base,
            margin: SIZES.base,
            marginHorizontal: SIZES.padding,
            borderWidth: .8,
            borderRadius: SIZES.base,
        }

        const text = {
            color: COLORS.black,
            paddingVertical: SIZES.base
        }

        let colorA, colorB, colorC, colorD;
        colorA = colorB = colorC = colorD = COLORS.gray;

        if (currentQuestion?.DapAn != undefined) {

            if (currentQuestion?.DapAn == 'A') {
                colorA = COLORS.colorRed;
            }
            if (currentQuestion?.DapAn == 'B') {
                colorB = COLORS.colorRed;
            }
            if (currentQuestion?.DapAn == 'C') {
                colorC = COLORS.colorRed;
            }
            if (currentQuestion?.DapAn == 'D') {
                colorD = COLORS.colorRed;
            }

            if (currentQuestion?.DASV == 'A') {
                colorA = COLORS.green;
            }
            if (currentQuestion?.DASV == 'B') {
                colorB = COLORS.green;
            }
            if (currentQuestion?.DASV == 'C') {
                colorC = COLORS.green;
            }
            if (currentQuestion?.DASV == 'D') {
                colorD = COLORS.green;
            }
        }

        return (
            <View style={{ flexDirection: 'column', marginBottom: 2 * SIZES.padding }}>
                <TouchableOpacity
                    onPress={() => pressOption('A')}
                    style={{
                        ...button
                        , borderColor:
                            isReviewMode ?
                                colorA
                                : (selectedOption == 'A' ? COLORS.green : COLORS.gray)
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.A}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('B')}
                    style={{
                        ...button
                        , borderColor:
                            isReviewMode ?
                                colorB
                                : (selectedOption == 'B' ? COLORS.green : COLORS.gray)
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.B}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('C')}
                    style={{
                        ...button
                        , borderColor: isReviewMode ?
                            colorC
                            : (selectedOption == "C" ? COLORS.green : COLORS.gray)
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.C}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('D')}
                    style={{
                        ...button
                        , borderColor:
                            isReviewMode ?
                                colorD
                                : (selectedOption == 'D' ? COLORS.green : COLORS.gray)
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.D}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /** Render */
    return (
        <View style={{ ...styles.container }}>

            {/** Loading */}
            <LoadingIndicator isLoading={isLoading}
                style={{
                    backgroundColor: state == undefined ? COLORS.white : COLORS.backgroundFade1
                }} />


            {/** Navigate Bar*/}
            {renderNavigateBar()}

            {/** Contents */}

            {state != stateInfo.testing &&

                /** Waiting */
                <WaitingTest />
            }

            {
                state != stateInfo.waiting &&

                /** Testing */
                <View style={{ flex: 1, }}>

                    {/** Ques num && menu button */}
                    {renderNumberAndMenuButton()}


                    {/** Question */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            ...STYLES.shadow,
                            borderRadius: SIZES.radius,
                            marginHorizontal: SIZES.radius,
                            maxHeight: SIZES.height * .4,
                        }}>
                        <Text style={{
                            padding: SIZES.padding,
                            fontSize: 16
                        }}>
                            {'\t\t\t'}{currentQuestion?.CauHoi}
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
                            onValueChange={setAutoNext}
                            value={autoNext}
                        />
                    </View>

                    {/** Options */}
                    <ScrollView>
                        {renderOptions()}
                    </ScrollView>

                    {/** Next & Revert */}
                    {renderFooter()}

                </View>
            }

            {/** Menu questions */}
            <MenuQuestionModal
                data={questList}
                isVisible={isShowMenuQuestion}
                onRequestClose={() => setShowMenuQuestion(!isShowMenuQuestion)}
                onPressItem={(item) => setCurrentQuestion(questList[item - 1])}
            />

            {/** Pause test */}
            <PauseTestModal isShow={state == stateInfo.paused} />


        </View>
    )
}

export default TestScreen

/** Styles */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    nextAndPreviousBox: {
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
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
    }
})
