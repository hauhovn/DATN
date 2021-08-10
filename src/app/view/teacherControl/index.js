import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
    AppState,
    Image,
    Alert,
} from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';

// Items
import { Header } from '../../components/header';
import { ItemJoinLeaveRoom } from './join-leave-room-item';

// Socket IO
import {
    inittiateSocket,
    requestServerLogs,
    disconnectSocket,
    reconectSocketAuto,
    listenStudentInOut,
    requestStartTest,
    requestUpdateTestList,
} from '../../../server/SocketIO';

// APIs
import { updateTestStatus } from '../../../server/BaiKiemTra/update-status';
import { getTestInfo } from '../../../server/TestInfo/get-test-info';
import { getInfoBeforeTest } from '../../../server/TestInfo/get-info-before-test';
import { AppRouter } from '../../../app/navigation/AppRouter';

export const TeacherControl = ({ route }) => {
    const nav = useNavigation();
    const user = route.params?.user;
    const BaiKiemTra = route.params?.BaiKiemTra;
    let _user = user[0];
    // Refs
    let flatList = React.useRef();
    const appState = React.useRef(AppState.currentState);

    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [usersStatusList, setUsersStatusList] = useState([]);
    const [reRender, setReRender] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [testStatus, setTestStatus] = useState(1);

    const statusInfo = ['Chưa hoàn thành', 'Bắt đầu', 'Tạm dừng', 'Tiếp tục'];
    const statusInfoAction = ['Chưa hoàn thành', 'Hủy bỏ', 'Kết thúc', 'Kết thúc'];
    //Effect
    useEffect(() => {
        pressConnect();
        reconectSocketAuto((err, data) => {
            if (err) return;
            console.log(data);
        });
        listenStudentInOut((err, data) => {
            if (err) return;
            console.log(data);
            setUsersStatusList(currentList => {
                return [...currentList, data];
            });
        });
        loadOption();
    }, []);

    //funcs
    async function loadOption() {
        await getOldInfo(BaiKiemTra.MaBaiKT);
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
        //console.log(MaBKT + 'RES: ', JSON.stringify(res));
        setUsersStatusList(res.data);
    }

    function pressConnect() {
        disconnectSocket();
        let data = {
            id: _user.MaGV,
            room: BaiKiemTra.MaBaiKT,
            name: _user.TenGV,
            is_teacher: true,
            socket_id: null,
        };
        inittiateSocket(BaiKiemTra.MaBaiKT, data);
    }

    // Press students list
    function pressStudentsList() {
        requestServerLogs();
    }

    // Back button
    const _leftHandle = () => {
        disconnectSocket();
        nav.goBack();
    };

    function startTest(isStart) {
        Alert.alert(
            'Bạn có chắc',
            `${isStart ? statusInfo[testStatus] : statusInfoAction[testStatus]} bài kiểm tra này?`,
            [
                {
                    text: 'Đồng ý',
                    onPress: () => {
                        if (isStart) {

                            if (testStatus < 2) {
                                // Start test
                                requestStartTest(_user.MaGV, BaiKiemTra.MaBaiKT, true);
                                setUsersStatusList(currentList => {
                                    return [
                                        ...currentList,
                                        {
                                            isConnect: true,
                                            status: 5,
                                            name: 'CÁC THÍ SINH ĐÃ BẮT ĐẦU LÀM BÀI',
                                        },
                                    ];
                                });
                                setTestStatus(2);
                            } else if (testStatus > 2) {
                                // Tiep tuc
                                requestStartTest(_user.MaGV, BaiKiemTra.MaBaiKT, true);
                                setUsersStatusList(currentList => {
                                    return [
                                        ...currentList,
                                        {
                                            isConnect: true,
                                            status: 2,
                                            name: 'BÀI KIỂM TRA ĐÃ TIẾP TỤC',
                                        },
                                    ];
                                });
                                setTestStatus(2);

                            } else {
                                // Tam dung
                                requestStartTest(_user.MaGV, BaiKiemTra.MaBaiKT, false);
                                setUsersStatusList(currentList => {
                                    return [
                                        ...currentList,
                                        {
                                            isConnect: true,
                                            status: 3,
                                            name: 'BÀI KIỂM TRA ĐÃ DỪNG LẠI',
                                        },
                                    ];
                                });
                                setTestStatus(3);
                            }

                        } else {
                            // Cancel or fini test  
                            updateTestStatus(_user.MaGV, BaiKiemTra.MaBaiKT, 0);
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
                    <Text style={[actionBar.text, { color: '#000', marginLeft: 15 }]}>
                        Thí sinh đã vào: 30/69
                    </Text>
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
                    {testStatus > 1 ? (<TouchableOpacity
                        onPress={() => pressStudentsList()}
                        style={[actionBar.button, actionBar.longButton]}>
                        <Text style={[actionBar.text]}>Danh Sách Thí Sinh</Text>
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

    // Render function main
    return (
        <View style={{ flex: 1 }}>
            <Header
                user={user}
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
                        <Text style={{ width: 170, textAlign: 'center', fontWeight: 'bold' }}>
                            LỊCH SỬ TRUY CẬP
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

                    /** List history */
                    <FlatList
                        ref={flatList}
                        style={styles.flatList}
                        onContentSizeChange={() => flatList.current.scrollToEnd()}
                        data={usersStatusList}
                        extraData={reRender}
                        keyExtractor={item =>
                            item.socketid + (Math.random() * 1000).toString()
                        }
                        renderItem={({ item }) => <ItemJoinLeaveRoom item={item} />}
                    />
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
                            Chưa có thí sinh tham gia
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
        backgroundColor: 'blue',
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
