import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
//MODUNs
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// Components
import { ItemTest, TestDetailModal } from '../components';

//APIs
import { inittiateSocket, teacherEditTest } from '../../../../server/SocketIO';
import { getBaiKiemTra } from '../../../../server/BaiKiemTra';

// Constants
import { ROUTE_NAME } from '../constants'
import { AppRouter } from '../../../navigation/AppRouter';
import { GIFS, COLORS, IMAGES } from '../../../assets/constants';


const StudentScreen = () => {

    // List item
    const listItemsHeader = [
        {
            key: ROUTE_NAME.LOP_HOC_PHAN,
            iconType: 'MaterialCommunityIcons',
            iconName: 'google-classroom',
            title: 'Lớp học phần'
        },
        {
            key: ROUTE_NAME.BAI_KIEM_TRA,
            iconType: 'FontAwesome',
            iconName: 'file-text-o',
            title: 'Bài kiểm tra'
        },
        {
            key: ROUTE_NAME.SAP_DIEN_RA,
            iconType: 'Ionicons',
            iconName: 'stopwatch-outline',
            title: 'Sắp diễn ra'
        },
        {
            key: ROUTE_NAME.DA_KET_THUC,
            iconType: 'Ionicons',
            iconName: 'checkmark-done-circle-outline',
            title: 'Đã kết thúc'
        },
    ];

    const nav = useNavigation();
    const [user, setUser] = useState('');
    const [listTest, setListTest] = useState(undefined);
    const [sentData, setSentData] = useState({
        MaSV: '',
        TenSV: '',
        MaBaiKT: '',
    });
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [refeshing, setRefeshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isNullTest, setIsNullTest] = useState(false);

    useEffect(() => {
        getAccount();
        teacherEditTest((err, isRemove) => {
            if (err) return;
            if (isRemove != undefined) {
                getTests();
            }
        });
    }, []);

    useEffect(() => {
        if (user !== '') {
            console.log('Sinh Vien: ', user);
            getTests();
            if (listTest?.lenght < 1) setIsNullTest(true);
            setIsLoading(false);
        }
    }, [user]);

    //funcs
    const getAccount = async () => {
        try {
            console.log('Sinh Vien: ', user);
            const res = await AsyncStorage.getItem('currentUser');
            setUser(JSON.parse(res));
        } catch (e) {
            // error reading value
        }
    };

    const getTests = async () => {
        let data = await getBaiKiemTra(user[0]?.MaSV, 3);
        console.log(`tests get: `, data);
        setListTest(data.data);
    };

    const HeaderHandle = value => {
        console.log('Handle value => ', value);
        if (value === ROUTE_NAME.SAP_DIEN_RA)
            nav.navigate(AppRouter.STUDENT_LIST_TEST, { MaSV: user[0]?.MaSV, TenSV: user[0]?.TenSV });
        if (value === ROUTE_NAME.BAI_KIEM_TRA)
            nav.navigate(AppRouter.STUDENT_TESTING_LIST, { MaSV: user[0]?.MaSV, TenSV: user[0]?.TenSV });
        if (value === ROUTE_NAME.LOP_HOC_PHAN)
            nav.navigate(AppRouter.LOP_HOC_PHAN, { SinhVien: user[0] });
        if (value === ROUTE_NAME.DA_KET_THUC)
            nav.navigate(AppRouter.STUDENT_COMPLETED_TEST_LIST, { MaSV: user[0]?.MaSV, TenSV: user[0]?.TenSV });
    };
    // Nhấn vô item
    const handlePressItem = item => {
        sentData.MaBaiKT = item.MaBaiKT;
        sentData.MaSV = user[0].MaSV;
        sentData.TenSV = user[0].TenSV;

        setSentData(sentData);
        setIsShowDialog(true);
    };

    const pressHandleKey = () => {
        setIsShowDialog(false);
        nav.navigate(AppRouter.MAIN, {
            screen: AppRouter.TESTING,
            params: { data: sentData },
        });
    };

    // Refesh test list
    const refeshListTetst = async () => {
        await setRefeshing(true);
        await getTests();
        if (listTest?.lenght < 1) await setIsNullTest(true);
        setRefeshing(false);
    };

    // Remote item from test list
    const removeTest = id => {
        setListTest(prevList => {
            return prevList.filter(test => test?.MaBaiKT != id);
        });
    };

    // Header items
    function headerItem(key, iconType, iconName, title) {

        return (
            <TouchableOpacity
                key={key}
                style={items.container}
                onPress={() => HeaderHandle(key)}>
                <View style={items.button}>
                    <Icon
                        type={iconType}
                        name={iconName}
                        style={{
                            fontSize: 20,
                            color: COLORS.colorMain,
                        }}
                    />
                </View>
                <Text style={items.textTitle}>{title}</Text>
            </TouchableOpacity>
        );
    }

    // Header
    function renderHeader() {
        return (
            <ImageBackground
                style={styles.imageBackground}
                source={IMAGES.gb_header}>

                {/** Title name + role */}
                <View style={header.title}>
                    <Text style={[header.subTitle, { fontWeight: 'bold', fontSize: 10 }]}>
                        Sinh viên
                    </Text>
                    <Text style={[header.subTitle, { marginTop: 2, fontSize: 14 }]}>
                        {user[0]?.TenSV}
                    </Text>
                </View>

                {/** List items */}
                <View style={header.listItems}>
                    {listItemsHeader.map(item => { return headerItem(item.key, item.iconType, item.iconName, item.title); }
                    )}
                </View>
            </ImageBackground>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            {/** Header */}
            {renderHeader()}

            {/** Body */}
            <View style={styles.body}>

                {/** Title */}
                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.colorGreen,
                        marginVertical: 5,
                        marginLeft: 10,
                        paddingTop: 20,
                        fontWeight: 'bold',
                    }}>
                    BÀI KIỂM TRA SẮP TỚI
                </Text>

                {/** Tests list */}
                <View style={styles.listTest}>
                    {!isLoading ? (
                        !isNullTest ? (
                            /** list */
                            <FlatList
                                refreshing={refeshing}
                                onRefresh={refeshListTetst}
                                data={listTest}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <ItemTest
                                        item={item}
                                        data={listTest}
                                        handle={handlePressItem}
                                    />
                                )}
                                keyExtractor={item => item.MaBaiKT}
                            />
                        ) : (

                            /** If list null */
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.colorMain,
                                    }}>
                                    Chưa có bài kiểm tra
                                </Text>
                            </View>
                        )
                    ) : (

                        /** Loading */
                        <View
                            style={{
                                width: '100%',
                                height: '80%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Image
                                source={GIFS.loading_3dot}
                                style={{ height: 80, width: 80 }}
                            />
                        </View>
                    )}
                </View>

                {/** Modal detail */}
                <TestDetailModal
                    navigation={nav}
                    modalVisible={isShowDialog}
                    close={() => {
                        setIsShowDialog(false);
                    }}
                    data={sentData}
                    pressHandle={() => {
                        pressHandleKey();
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default StudentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    imageBackground: {
        flex: 2.5,
        resizeMode: 'contain',
    },
    body: {
        flex: 7.5,
    },
    listTest: {
        flex: 1,
    },
});
const header = StyleSheet.create({
    title: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
    },
    subTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listItems: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

const items = StyleSheet.create({
    container: {
        height: '100%',
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: 40,
        width: 40,
        margin: 10,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#CFD8DC',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    textTitle: {
        marginTop: -5,
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
