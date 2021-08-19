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
import { getSubjectDetail, getTestingDetailt } from '../../../server';

/** Components */
import { LoadingIndicator } from '../student/components'
import { COLORS, STYLES, SIZES } from '../../assets/constants';

export const TeacherControl = ({ route, navigation }) => {

    const nav = navigation;
    const _user = route.params?.user;
    const BaiKiemTra = route.params?.BaiKiemTra;
    const user = { id: _user[0]?.MaGV, name: _user[0]?.TenGV };

    // Refs
    let flatList = React.useRef();
    const appState = React.useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [usersStatusList, setUsersStatusList] = useState([]);
    const [usersTestDetailList, setUsersTestDetailList] = useState([]);
    const [reRender, setReRender] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMain, setLoadingMain] = useState(false);
    const [testStatus, setTestStatus] = useState(1);
    const [studentsQuantity, setStudentsQuantity] = useState(0);
    const [studentTestQuantity, setStudentTestQuantity] = useState(0);

    const statusInfo = ['Chưa hoàn thành', 'Bắt đầu', 'Tạm dừng', 'Tiếp tục', 'Tạm dừng'];
    const statusColor = [COLORS.black, COLORS.black, COLORS.black, COLORS.black, COLORS.black];
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
    })

    useEffect(() => {

        if (titleListText == textButton[1]) return;

        /** Get testing detail */
        getTesting_detail(BaiKiemTra.MaBaiKT);

    }, [titleListText])

    /** Load option */
    const loadOption = async () => {

        /** check test */
        await checkTestStatus(BaiKiemTra.MaBaiKT);

        /** get old data */
        await getOldInfo(BaiKiemTra.MaBaiKT);

        /** Get student quantity */
        await getStudentQuantity(BaiKiemTra.MaBaiKT);

        /** stop loading */
        setIsLoading(false);
    }

    /** Socket IO */
    const socketIOListener = async () => {

        disconnectSocket();
        inittiateSocket(BaiKiemTra.MaBKT, user, 'ko', 1);

        listenStudentInOut((err, data) => {
            if (err) return;
            console.log(data);
            setUsersStatusList(currentList => {
                return [...currentList, data];
            });
        });
    }

    /** Check test status */
    const checkTestStatus = async (testID) => {

        let response = await getTestStatus(null, testID);
        console.log(`res=`, response);
        setTestStatus(response.status)
    }

    /** Get students quantity */
    const getStudentQuantity = async (MaBKT) => {
        let rs = await getSubjectDetail(1, MaBKT);
        if (rs.code > 0) setStudentsQuantity(rs.data?.SoLuongSinhVien)
    }

    /** Testing detailt */
    const getTesting_detail = async (testID, sort) => {
        setIsLoading(true);
        console.log(`dattestIDa_`, testID);
        let rs = await getTestingDetailt(testID, sort);
        if (rs.code <= 0) {
            setIsLoading(false); return;
        };
        console.log(`data_`, rs.data);
        await setUsersTestDetailList(rs.data)
        setIsLoading(false);
    }

    async function getOldInfo(MaBKT) {
        setUsersStatusList([]);
        let res = await getTestInfo(MaBKT, 1);
        //console.log(MaBKT + 'RES: ', JSON.stringify(res));
        setUsersStatusList(res.data);
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
    const testStatusUpdate = async (toStatus) => {

        setLoadingMain(true);

        let rs = await updateTestStatus(user.id, BaiKiemTra.MaBaiKT, toStatus);

        await setTimeout(() => {
            rs?.code == toStatus && setLoadingMain(false)
        }, 2000);
    }

    function startTest(isStart) {
        Alert.alert(
            'Bạn có chắc',
            `${isStart ? statusInfo[testStatus] : statusInfoAction[testStatus]} bài kiểm tra này?`,
            [
                {
                    text: 'Đồng ý',
                    onPress: () => {
                        if (isStart) {

                            switch (testStatus) {
                                case '1': {
                                    /** Waiting =>  Start test */
                                    requestStartTest(user.id, BaiKiemTra.MaBaiKT, true);
                                    setUsersStatusList(currentList => {
                                        return [
                                            ...currentList,
                                            {
                                                isConnect: true,
                                                status: 5,
                                                name: 'CÁC THÍ SINH ĐÃ \n BẮT ĐẦU LÀM BÀI',
                                            },
                                        ];
                                    });
                                    testStatusUpdate(2);
                                    setTestStatus(2);
                                } break;
                                case '2': {
                                    /**Runing => Pause test */
                                    requestStartTest(user.id, BaiKiemTra.MaBaiKT, true);
                                    setUsersStatusList(currentList => {
                                        return [
                                            ...currentList,
                                            {
                                                isConnect: true,
                                                status: 3,
                                                name: 'BÀI KIỂM TRA \nĐÃ DỪNG LẠI',
                                            },
                                        ];
                                    });
                                    testStatusUpdate(3);
                                    setTestStatus(3);
                                } break;
                                case '3': {
                                    /**Pause => Continue test (Runing)*/
                                    requestStartTest(user.id, BaiKiemTra.MaBaiKT, true);
                                    setUsersStatusList(currentList => {
                                        return [
                                            ...currentList,
                                            {
                                                isConnect: true,
                                                status: 2,
                                                name: 'BÀI KIỂM TRA \nĐÃ TIẾP TỤC',
                                            },
                                        ];
                                    });
                                    testStatusUpdate(2);
                                    setTestStatus(2);
                                } break;
                                case '4': console.log(4); break;
                                default: break;
                            }

                        } else {
                            // Cancel or fini test  
                            testStatusUpdate(0);
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

    // Control Bar Render
    function renderControlBar() {
        return (
            <View style={actionBar.container}>
                <View style={actionBar.row}>

                    {/** Class quantity */}
                    <Text style={[actionBar.text, { color: '#000', marginLeft: 15 }]}>
                        Thí sinh đã vào: {studentTestQuantity}/{studentsQuantity}
                    </Text>

                    {/** Button start/pause/resume */}
                    <TouchableOpacity
                        onPress={() => startTest(true)}
                        style={[
                            actionBar.button,
                            actionBar.shortButton,
                            { backgroundColor: '#02ad02' },
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

    /** List history & test detail */
    function renderListAction() {

        const renderItem = (item) => {
            return (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>
                        {item.TenSV}
                    </Text>

                    <Text>
                        {item.TongSoCauDung} /{item.TongSoCauSai}/ {item.TongSoCauSai + item.TongSoCauDung}
                    </Text>

                </View>
            )
        }

        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>

                {/** List history */}
                <Animated.View style={{ width: SIZES.width, right: listMarginRight }}>
                    <FlatList
                        ref={flatList}
                        style={{ ...styles.flatList }}
                        onContentSizeChange={() => flatList.current.scrollToEnd()}
                        data={usersStatusList}
                        extraData={reRender}
                        keyExtractor={item =>
                            item.socketid + (Math.random() * 1000).toString()
                        }
                        renderItem={({ item }) => <ItemJoinLeaveRoom item={item} />}
                    />
                </Animated.View>

                {/** List test detail */}
                <Animated.View style={{ width: SIZES.width, right: listMarginRight }}>
                    <FlatList
                        style={{ ...styles.flatList }}
                        data={usersTestDetailList}
                        extraData={reRender}
                        keyExtractor={(item, index) => `${item}_${index}`
                        }
                        renderItem={({ item }) => renderItem(item)}
                    />
                </Animated.View>
            </View>
        )
    }

    // Render main
    return (
        <View style={{ flex: 1 }}>
            <LoadingIndicator isLoading={isLoadingMain} />
            <Header
                isTeacher={true}
                name={user.name}
                user={[]}
                leftHandle={() => {
                    _leftHandle();
                }}
            />
            <View style={{ flex: 1 }}>

                {/** ---Control bar--- */}
                {renderControlBar()}

                {/**  Title actions list*/}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#ebebeb',
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
                            source={require('../../../app/asset/gif/load321.gif')}
                            style={{ height: 120, width: 120, marginTop: -250 }}
                        />
                    </View>
                ) : usersStatusList?.length > 0 ? (

                    /** List history & test detail*/
                    renderListAction()

                ) : (

                    /** When list null */
                    <View
                        style={{
                            width: '100%',
                            height: '80%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ebebeb',
                        }}>
                        <Text style={{ fontSize: 14, marginTop: -250 }}>
                            Chưa có thông tin mới
                        </Text>
                    </View>
                )}
            </View>
        </View >
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ebebeb',
    },
    buttons: {
        flexDirection: 'column',
    },
    actionBar: {},
    listActionsTitle: {},
    flatList: {
        flex: 1,
        backgroundColor: '#ebebeb',
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
        backgroundColor: '#ebebeb',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    text: { fontSize: 14, color: '#fff', textTransform: 'uppercase' },
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
