import React from 'react';
import {
    View, Text, TouchableOpacity,
    StyleSheet, Image, ScrollView,
    Switch
} from 'react-native';

import { Icon } from 'native-base';

// Apis
import {
    UpdateQuestion,
    JointTest,
    getTestStatus
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
        waiting: 'waiting_k',
        testing: 'testing_k',
        paused: 'paused_k'
    }
    /** Get routes MaBaiKT, MaSV, TenSV*/
    const data = route.params?.data;
    const thisStudent = {
        name: data?.TenSV,
        id: data?.MaSV
    }, thisTest = { id: data?.MaBaiKT }


    const [state, setState] = React.useState(stateInfo.waiting);
    const [autoNext, setAutoNext] = React.useState(true);
    const [isShowMenuQuestion, setShowMenuQuestion] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [isUpdate, setUpdate] = React.useState(false);

    const [selectedOption, setSelectedOption] = React.useState(undefined);
    const [selectedQuestion, setSelectedQuestion] = React.useState(undefined);

    const [questList, setQuestList] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(undefined);


    React.useEffect(() => {

        /** Load option */
        LoadOption();

        /** Socket IO Listener */
        SocketIO();

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
        inittiateSocket(thisTest.id, userForSocket, state, 1);

        /** Listener */

        /** Teacher start or pause test */
        serverStartTest((err, isStart) => {
            if (err) return;
            if (isStart) setState(stateInfo.testing);
            else setState(stateInfo.paused);
        });

        teacherEditTest((err, data) => {
            if (err) return;
            console.log(`t edit t: `, data);
        });

    }

    /** Load option */
    const LoadOption = async () => {

        setLoading(true);

        /** Get Quests List */
        await getQuestList();

        /** Get test status */
        await getTest_Status();

        setLoading(false);
    }

    /** Get test status */
    const getTest_Status = async () => {
        let response = await getTestStatus(thisStudent.id, thisTest.id);
        console.log(`res: `, response);
        switch (response?.status) {
            case '1': setState(stateInfo.waiting); break;
            case '2': setState(stateInfo.testing); break;
            case '3': setState(stateInfo.paused); break;
            default: setState(stateInfo.waiting);
        }
    }

    /** Get test data */
    const getQuestList = async () => {

        let response = await JointTest(thisStudent.id, thisTest.id);
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

        selectedOption == option ? setSelectedOption('X') : setSelectedOption(option);
        setSelectedQuestion(currentQuestion);
        setUpdate(true);

    }

    /**  Render*/
    function renderNavigateBar() {

        return (<View>
            <MyAppBar
                title={'Waiting . .  .'}
                child={state !== stateInfo.waiting && (<MyCountDown time={60 * 100} />)}
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
                ...styles.nextRevertBox
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

        return (
            <View style={{ flexDirection: 'column', marginBottom: 2 * SIZES.padding }}>
                <TouchableOpacity
                    onPress={() => pressOption('A')}
                    style={{
                        ...button
                        , borderColor: selectedOption == 'A' ? COLORS.colorMain : COLORS.gray
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.A}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('B')}
                    style={{
                        ...button
                        , borderColor: selectedOption == 'B' ? COLORS.colorMain : COLORS.gray
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.B}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('C')}
                    style={{
                        ...button
                        , borderColor: selectedOption == 'C' ? COLORS.colorMain : COLORS.gray
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.C}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => pressOption('D')}
                    style={{
                        ...button
                        , borderColor: selectedOption == 'D' ? COLORS.colorMain : COLORS.gray
                    }}>
                    <Text style={{ ...text }}>{currentQuestion?.D}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /** Render */
    return (
        <View style={{ ...styles.container }}>

            {/** Navigate Bar*/}
            {renderNavigateBar()}

            {/** Contents */}

            {state == stateInfo.waiting ?
                (
                    /** Waiting */
                    <WaitingTest />
                ) :
                /** Testing */
                <View style={{ flex: 1 }}>

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

            {/** Loading . . . */}
            <LoadingIndicator isLoading={isLoading} />

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
    nextRevertBox: {
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
