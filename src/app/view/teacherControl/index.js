import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
    AppState,
    Image,
    Alert,
    Animated
} from 'react-native';

// Items
import { Header } from '../../components/header';
import { ItemJoinLeaveRoom } from './join-leave-room-item';

// Socket IO
import {
    inittiateSocket,
    requestServerLogs,
    disconnectSocket,
    listenStudentInOut,
    requestStartTest,
    requestUpdateTestList,
} from '../../../server/SocketIO';

// APIs
import { updateTestStatus } from '../../../server/BaiKiemTra/update-status';
import { getTestInfo } from '../../../server/TestInfo/get-test-info';
import { getInfoBeforeTest } from '../../../server/TestInfo/get-info-before-test';
import { AppRouter } from '../../../app/navigation/AppRouter';
import { getTestStatus } from '../../../server/student-apis';
import {
    getSubjectDetail,
    getTestingDetailt,
    getCTBaiKiemTra,
    setTimeTest,
    getTimeTest
} from '../../../server';

/** Components */
import {
    LoadingIndicator,
    DialogPickerModal,
    TestingDetailItem,
    MyCountDown
} from '../student/components'
import { COLORS, STYLES, SIZES, GIFS } from '../../assets/constants';
import { Icon } from 'native-base';
import moment from 'moment';
moment.locale('vi')
import CountDown from 'react-native-countdown-component';

export const TeacherControl = ({ route, navigation }) => {

    const nav = navigation;
    const _user = route.params?.user;
    const BaiKiemTra = route.params?.BaiKiemTra;
    const user = {
        id: _user[0]?.MaGV,
        room: BaiKiemTra.MaBaiKT,
        name: _user[0]?.TenGV,
        is_teacher: true,
        socket_id: ''
    };

    // Refs
    let flatList = React.useRef();
    let selectedItem = undefined;
    const appState = React.useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [usersStatusList, setUsersStatusList] = useState([]);
    const [usersTestDetailList, setUsersTestDetailList] = useState([]);
    const [reRender, setReRender] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMain, setLoadingMain] = useState(false);
    const [isLoad2, setLoad2] = useState(false);
    const [testStatus, setTestStatus] = useState(1);
    const [studentsQuantity, setStudentsQuantity] = useState(0);
    const [studentTestQuantity, setStudentTestQuantity] = useState(0);
    const [testInfo, setTestInfo] = useState(undefined);

    const [timeTest, setTimeTest] = useState(0);
    const [isTimeRunning, setTimeRunning] = useState(false);

    const statusInfo = ['Chưa hoàn thành', 'Bắt đầu', 'Tạm dừng', 'Tiếp tục', 'Tạm dừng'];
    const statusColor = [COLORS.green, COLORS.green, COLORS.yellow, COLORS.green, COLORS.yellow];
    const statusInfoAction = ['Chưa hoàn thành', 'Hủy bỏ', 'Kết thúc', 'Kết thúc', 'Kết thúc'];
    const textButton = ['chi tiết kiểm tra', 'lịch sử truy cập'];
    const [buttonText, setButtonText] = useState(textButton[0]);
    const [titleListText, setTitleListText] = useState(textButton[1]);

    const listMarginRight = useRef(new Animated.Value(0)).current;
    const listOpacity = new Animated.Value(1);

    //Effect
    useEffect(() => {

        /** Load */
        loadOption();

        /** Socket listen */
        socketIOListener();

    }, []);

    useEffect(() => {

        if (titleListText == textButton[1]) return;

        /** Get testing detail */
        getTesting_detail(BaiKiemTra.MaBaiKT);

    }, [titleListText])

    /** Check status */
    useEffect(() => {
        try {
            if (parseInt(testStatus) == 2) setTimeRunning(true)
            console.log(`dang chay dung k: ${testStatus}`);
        } catch (error) {
            console.log(`Error in useEffect`);
        }
    }, [testStatus])

    /** Load option */
    const loadOption = async () => {

        /** check test */
        await checkTestStatus(BaiKiemTra.MaBaiKT);

        console.log(`1`);

        /** Get test info */
        await getTestInfo(BaiKiemTra.MaBaiKT);

        console.log(testInfo);

        /** Get student quantity */
        await getStudentQuantity(BaiKiemTra.MaBaiKT);

        /** Get time show */
        await getTimeOfTest();

        /** get old data */
        await getOldInfo(BaiKiemTra.MaBaiKT);

        /** stop loading */
        setIsLoading(false);

    }

    /** Socket IO */
    const socketIOListener = async () => {

        await disconnectSocket();
        await inittiateSocket(BaiKiemTra.MaBaiKT, user, 'ko', 1);

        listenStudentInOut((err, data) => {
            if (err) return;
            console.log(`# Co SV moi tham gia: `, data);
            addTestStatusInfo(
                res = data
            )

        });
    }

    /** Check test status */
    const checkTestStatus = async (testID) => {

        let response = await getTestStatus(null, testID);
        console.log(`res=`, response);
        setTestStatus(response.status);
    }

    /** Get test info */
    const getTestInfo = async (id) => {

        const rs = await getCTBaiKiemTra(0, id);
        console.log(`log 1: `, rs.data);
        let ok = rs.data;
        console.log(`ok`, ok);
        setTestInfo(ok);
        console.log(`CTBKT: `, testInfo);
    }

    /** Get students quantity */
    const getStudentQuantity = async (MaBKT) => {
        let rs = await getSubjectDetail(1, MaBKT);
        if (rs.code > 0) setStudentsQuantity(rs.data?.SoLuongSinhVien)
    }

    /** Testing detailt */
    const getTesting_detail = async (testID, sort) => {
        setLoad2(true);
        let rs = await getTestingDetailt(testID, sort);
        if (rs.code <= 0) {
            setLoad2(false); return;
        };
        await setUsersTestDetailList(rs.data)
        setLoad2(false);
    }

    /** Set Time Of Test */
    // const setTimeOfTest = async () => {
    //     const rs = await setTimeTest(BaiKiemTra.MaBaiKT);
    //     console.log(`_@_`, rs);
    // }

    const getTimeOfTest = async () => {
        // const rs = await getTimeTest(BaiKiemTra.MaBaiKT);
        // console.log(rs);

        // var timeSplit = rs?.data?.ThoiGian.split(':');
        // await setTimeTest(parseInt(timeSplit[0]) * 60 * 60 + parseInt(timeSplit[1]) * 60 + parseInt(timeSplit[2]));
        // console.log(`thoi gian duoc cap nhat lai la: `, timeTest);

        // Viết lại hàm cập nhật thời gian

    }

    async function getOldInfo(MaBKT) {
        setUsersStatusList([]);
        const res = await getTestInfo(MaBKT, 1);
        console.log(MaBKT + 'RES: ', JSON.stringify(res));
        setUsersStatusList(res?.data);
    }
    async function getOldInfoBefore(MaBKT) {
        setUsersStatusList([]);
        let res = await getInfoBeforeTest(MaBKT);
        console.log(MaBKT + 'RES: ', JSON.stringify(res));
        setUsersStatusList(res.data);
    }

    // Press students list
    function pressStudentsList() {

        if (listMarginRight._value > 0) {
            setButtonText(textButton[0]);
            setTitleListText(textButton[1])
        } else {

            setButtonText(textButton[1]);
            setTitleListText(textButton[0])
        }

        const listMarginRightAnim = Animated.timing(listMarginRight, {
            toValue: listMarginRight._value > 0 ? 0 : SIZES.width,
            duration: 300,
            useNativeDriver: false
        })

        const listOpacityAnim = Animated.timing(listOpacity, {
            toValue: listMarginRight._value > 0 ? 0 : 1,
            duration: listMarginRight._value > 0 ? 0 : 300,
            useNativeDriver: false
        })

        Animated.stagger(300, [
            listOpacityAnim,
            listMarginRightAnim,
        ]).start();
    }

    // Back button
    const _leftHandle = () => {
        disconnectSocket();
        nav.goBack();
    };

    /** Update test status */
    const testStatusUpdate = async (toStatus, isUpdateTestTime = -1) => {

        setLoadingMain(true);

        let rs = await updateTestStatus(user.id, BaiKiemTra.MaBaiKT, toStatus, isUpdateTestTime);
        rs?.code == toStatus && setLoadingMain(false)
        console.log('-------- rs ne', rs);
    }
    // Control Bar Render
    function renderControlBar() {

        /** Press start button*/
        const startTest = (isStart) => {

            console.log(`>>>>>>>>>>>> Hàm phía bên trong chạy nè = ${isStart} = ${testStatus}`);

            Alert.alert(
                'Bạn có chắc',
                `${isStart ? statusInfo[testStatus] : statusInfoAction[testStatus]} bài kiểm tra này?`,
                [
                    {
                        text: 'Đồng ý',
                        onPress: () => {
                            if (isStart) {

                                switch (parseInt(testStatus)) {
                                    case 1: {
                                        /** Waiting =>  Start test */
                                        requestStartTest(user.id, BaiKiemTra.MaBaiKT, true);

                                        addTestStatusInfo(true, 5, 'CÁC THÍ SINH ĐÃ \n BẮT ĐẦU LÀM BÀI');
                                        try {
                                            testStatusUpdate(2, 1);
                                            setTestStatus(2);
                                            //setTimeOfTest();
                                            setTimeRunning(true);
                                        } catch (error) {
                                            console.log(`#327_3line`);
                                        }
                                    } break;
                                    case 2: {
                                        /**Runing => Pause test */
                                        console.log(`run_2_@`);
                                        requestStartTest(user.id, BaiKiemTra.MaBaiKT, false);

                                        addTestStatusInfo(true, 3, 'BÀI KIỂM TRA \nĐÃ DỪNG LẠI');
                                        try {
                                            testStatusUpdate(3);
                                            setTestStatus(3);
                                            setTimeRunning(false);
                                        } catch (error) {
                                            console.log(`#345_3line`);
                                        }
                                    } break;
                                    case 3: {
                                        /**Pause => Continue test (Runing)*/
                                        console.log(`run_3_@`);
                                        requestStartTest(user.id, BaiKiemTra.MaBaiKT, true);
                                        addTestStatusInfo(true, 2, 'BÀI KIỂM TRA \nĐÃ TIẾP TỤC');
                                        try {
                                            testStatusUpdate(2);
                                            setTestStatus(2);
                                            setTimeRunning(true);
                                        } catch (error) {
                                            console.log(`#381_3line`);
                                        }
                                    } break;
                                    case 4: console.log(4); break;
                                    default: break;
                                }

                            } else {
                                // Cancel or fini test  
                                testStatusUpdate(4);
                                setTimeout(() => {
                                    requestUpdateTestList(true, BaiKiemTra.MaBaiKT);
                                }, 2000);
                                Alert.alert(
                                    `Thông báo`,
                                    `Đã ${statusInfoAction[testStatus].toLowerCase()} bài kiểm tra ${BaiKiemTra.TenBaiKT} `,
                                );
                                nav.navigate(AppRouter.LISTLHP);
                            }
                        }
                    },

                    {
                        text: 'Bỏ qua',
                    },
                ],
            );
        }

        const _getTimeTest = () => {
            const time = testInfo?.ThoiGianLam.split(':'); // split it at the colons
            const timeTest = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);
            return parseInt(timeTest);
        }

        return (
            <View style={actionBar.container}>
                <View style={{
                    ...actionBar.row,
                    borderBottomWidth: .3,
                    alignItems: 'center',
                }}>
                    {timeTest > 0 &&
                        <MyCountDown
                            time={testInfo != undefined && _getTimeTest()}
                            isRuning={isTimeRunning}
                            onFinish={() => Alert.alert('Timeup')}
                        />

                    }
                    <Text>Time</Text>
                </View>
                <View style={actionBar.row}>

                    {/** Class quantity */}
                    <View style={{ ...actionBar.row, alignItems: "center", justifyContent: 'flex-start' }}>
                        <TouchableOpacity
                            onPress={() => Alert.alert('Mo danh sach may dua da vao, chua vao')}
                        >
                            <Icon
                                type="Entypo"
                                name="list"
                                style={{ fontSize: 23 }} />
                        </TouchableOpacity>
                        <Text style={[actionBar.text, { color: '#000', marginLeft: 5 }]}>
                            Thí sinh đã vào: {studentTestQuantity}/{studentsQuantity}
                        </Text>
                    </View>

                    {/** Button start/pause/resume */}
                    <TouchableOpacity
                        onPress={() => { startTest(true); console.log(`>>>>>>>> Bấm dòi nè`); }}
                        style={[
                            actionBar.button,
                            actionBar.shortButton,
                            { backgroundColor: statusColor[testStatus] },
                        ]}>
                        <Text style={actionBar.text}>{statusInfo[testStatus]}</Text>
                    </TouchableOpacity>
                </View>
                <View style={actionBar.row}>

                    {/** Button cancel */}
                    {testStatus > 1 ? (<TouchableOpacity
                        onPress={() => pressStudentsList()}
                        style={[actionBar.button, actionBar.longButton]}>
                        <Text style={[actionBar.text]}>{buttonText}</Text>
                    </TouchableOpacity>) : <View />
                    }
                    <TouchableOpacity
                        onPress={() => startTest(false)}
                        style={[
                            actionBar.button,
                            actionBar.shortButton,
                            { backgroundColor: 'red' },
                        ]}>
                        <Text style={[actionBar.text]}>{statusInfoAction[testStatus]}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    function addTestStatusInfo(
        isConnect = true, status = 2,
        info = 'BÀI KIỂM TRA \nĐÃ TIẾP TỤC',
        name = ' ', socket_id = Math.random().toString(),
        res = undefined
    ) {
        try {

            let newInfo = {
                isConnect: isConnect,
                status: status,
                name: name,
                info: info,
                socket_id: socket_id
            };

            if (res != undefined) newInfo = res;

            if (usersStatusList.length > 0) {
                setUsersStatusList([...usersStatusList, newInfo])
                console.log(`usersStatusList.length > 0`);
            } else {
                setUsersStatusList([newInfo])
                console.log(`usersStatusList.length = 0`);
            }
        } catch (error) {
            console.log(`Khong the them thong bao`);
        }
    }

    /** List history & test detail */
    function renderListAction() {

        const dialogData = [
            { TenLopHP: 'Làm đúng nhiều nhất', MaLopHP: 1 },
            { TenLopHP: 'Làm sai nhiều nhất', MaLopHP: 2 },
            { TenLopHP: 'Tổng số câu đã làm nhiều nhất', MaLopHP: 3 },
            { TenLopHP: 'Tổng số câu đã làm it nhất', MaLopHP: 4 },];

        const renderItem = (item) => {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: SIZES.base,
                    paddingHorizontal: SIZES.base,
                    alignItems: 'center',
                    ...STYLES.shadow,
                    paddingVertical: SIZES.base
                }}>
                    <Text style={{
                        fontSize: 15,
                        textTransform: 'capitalize',
                        maxWidth: '40%'
                    }}>
                        {item.TenSV}
                    </Text>

                    <TestingDetailItem
                        quantityCorrect={item.TongSoCauDung}
                        quantityUncorrect={item.TongSoCauSai}
                        total={testInfo?.SoLuongCauHoi}
                    />

                </View>
            )
        }

        const pressItem = (item) => {
            selectedItem = item;
            switch (item) {
                case 1: getTesting_detail(BaiKiemTra.MaBaiKT); break;
                case 2: getTesting_detail(BaiKiemTra.MaBaiKT, 1); break;
                case 3: getTesting_detail(BaiKiemTra.MaBaiKT); break;
                case 4: getTesting_detail(BaiKiemTra.MaBaiKT, 1); break;
            }
        }

        return (
            <View style={{
                flex: 1, flexDirection: 'row',
                backgroundColor: COLORS.white
            }}>

                {/** List history */}
                <Animated.View style={{ width: SIZES.width, right: listMarginRight }}>
                    {usersStatusList?.length > 0 ? (
                        <FlatList
                            style={{ backgroundColor: COLORS.white }}
                            ref={flatList}
                            style={{ ...styles.flatList }}
                            onContentSizeChange={() => flatList.current.scrollToEnd()}
                            data={usersStatusList}
                            extraData={reRender}
                            keyExtractor={item =>
                                item.socketid + (Math.random() * 1000).toString()
                            }
                            renderItem={({ item }) => <ItemJoinLeaveRoom item={item} />}
                        />) :
                        <View
                            style={{
                                width: '100%',
                                height: '80%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: COLORS.white,
                            }}>
                            <Text style={{ fontSize: 14, marginTop: -150, color: COLORS.gray }}>
                                Chưa có thông tin mới
                            </Text>
                        </View>}
                </Animated.View>

                {/** List test detail */}
                <Animated.View
                    style={{
                        width: SIZES.width,
                        right: listMarginRight,
                        backgroundColor: COLORS.white
                    }}>
                    <DialogPickerModal
                        filterBarStyle={{
                            borderBottomWidth: .6,
                            borderColor: COLORS.gray,
                            paddingBottom: SIZES.base,
                        }}
                        textStyles={{
                            color: COLORS.colorMain,
                            fontWeight: 'bold',
                            justifyContent: 'center'
                        }}
                        addAllItem={false}
                        data={dialogData}
                        handle={(item) => {
                            pressItem(item?.MaLopHP);
                        }}
                    />
                    {
                        isLoad2 ?
                            <LoadingIndicator />
                            :
                            <FlatList
                                style={{ ...styles.flatList }}
                                data={usersTestDetailList}
                                extraData={reRender}
                                keyExtractor={(item, index) => `${item}_${index}`
                                }
                                renderItem={({ item }) => renderItem(item)}
                            />
                    }
                </Animated.View>
            </View>
        )
    }

    // Render main
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.white
        }}>
            <LoadingIndicator isLoading={isLoadingMain} />
            <Header
                isTeacher={true}
                name={user.name}
                user={[]}
                leftHandle={() => {
                    _leftHandle();
                }}
            />
            <View style={{ flex: 1, backgroundColor: COLORS.white }}>

                {/** ---Control bar--- */}
                {renderControlBar()}

                {/**  Title actions list*/}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: COLORS.white,
                    }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 170, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {titleListText}
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                </View>

                {/** ---Action list--- */}
                {isLoading ? (

                    /** Loading */
                    <View
                        style={{
                            width: '100%',
                            height: '80%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ebebeb',
                        }}>
                        <Image
                            source={GIFS.load321}
                            style={{ height: 120, width: 120, marginTop: -250 }}
                        />
                    </View>
                ) : renderListAction()
                }
            </View>
        </View >
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
    },
    buttons: {
        flexDirection: 'column',
    },
    actionBar: {},
    listActionsTitle: {},
    flatList: {
        flex: 1,
        backgroundColor: COLORS.white,
        marginVertical: 15,
    },
    buttonBox: {
        width: 120,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    button: {
        width: 60,
        padding: 15,
        borderRadius: 5,
    },
    texts: {
        padding: 10,
        fontSize: 24,
        color: '#fff',
    },
    input: {
        padding: 5,
        width: '50%',
        color: '#fff',
        backgroundColor: '#537067',
    },
});
const actionBar = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 12,
        borderColor: '#888',
        backgroundColor: COLORS.white,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    text: {
        fontSize: 14,
        color: COLORS.white,
        textTransform: 'uppercase'
    },
    button: {
        ...STYLES.shadow,
        backgroundColor: COLORS.blue,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shortButton: {
        width: 100,
    },
    longButton: {
        width: 170,
    },
});
