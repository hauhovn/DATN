import React, { useState, useEffect } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
//modun
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Icon, Picker } from 'native-base';
//api
import { getBaiKiemTra } from '../../../../server/BaiKiemTra';
import { getBaiKiemTraTheoLopHocPhan } from '../../../../server/BaiKiemTra/get-bkt-theo-lhp';
import { teacherEditTest } from '../../../../server/SocketIO';
import { getMiniLopHocPhan } from '../../../../server/LopHP/getListNameLHP';
//settting
import { settings } from '../../../config';
import { AppRouter } from '../../../../app/navigation/AppRouter';

// Components
import { ItemTest, TestDetailModal, MyAppBar, DialogPickerModal, LoadingIndicator } from '../components';
import { COLORS, SIZES } from '../../../assets/constants';

const StudentTestingList = ({ navigation, route }) => {


    const nav = useNavigation();
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [refeshing, setRefeshing] = useState(false);
    const [getMore, setGetMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState('');
    const [listTenLHP, setListTenLHP] = useState('');
    const [pickerLHP, setPickerLHP] = useState({ MaLopHP: -1, TenLopHP: 'Tất cả' });

    const [sentData, setSentData] = useState({
        MaBaiKT: '',
        TenBaiKT: '',
        TenSV: ''
    });
    const SinhVien = route.params;

    let page = 0;
    const quantity = 10;

    useEffect(() => {
        try {
            teacherEditTest((err, isRemove) => {
                if (err) return;
                if (isRemove != undefined) {
                    refeshData();
                }
            });
        } catch (error) { }
        loadOption();
    }, []);

    async function loadOption() {
        try {
            await getListLPH();
            await getTests(quantity, page);
            setLoading(false);
        } catch (error) { }
    }

    const getListLPH = async () => {
        let res = await getMiniLopHocPhan(SinhVien.MaSV);
        res?.data != undefined && setListTenLHP(res.data);
        console.log('LIST LHPs: ', res.data);
    };

    // Get test = LHP
    const getTestWith = async (MaSV, MaLHP, SL, Page, add) => {
        let res = await getBaiKiemTraTheoLopHocPhan(MaSV, MaLHP, SL, Page);
        add ? setData(data.concat(res?.data)) : setData(res.data);
    }

    const getTests = async (quantity, page, add) => {
        let res = await getBaiKiemTra(SinhVien.MaSV, quantity, page, 1);
        add ? setData(data.concat(res?.data)) : setData(res.data);
    };

    // Class picker
    const classPicker = (item) => {

        setLoading(true);
        page = 0;
        setPickerLHP(item);

        if (item.MaLopHP == -1) {
            // Get all
            loadOption();
        } else {
            // get with code
            getTestWith(SinhVien.MaSV, item.MaLopHP, quantity, page);
        }

        setTimeout(() => {
            setLoading(false)
        }, 500)
        //fake();
    }

    // Nhấn vô item
    const handlePressItem = item => {
        sentData.MaBaiKT = item.MaBaiKT;
        sentData.MaSV = SinhVien.MaSV;
        sentData.TenSV = SinhVien.TenSV;
        console.log('SINH VIEN: ', SinhVien);
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

    // Refesh data
    async function refeshData() {

        setRefeshing(true);
        page = 0;

        // All
        if (pickerLHP.MaLopHP == -1) {

            await loadOption();
        } else {
            getTestWith(SinhVien.MaSV, pickerLHP.MaLopHP, quantity, page, false);
        }
        setRefeshing(false);
    }

    // Get more data
    async function getMoreData() {
        console.log('get get');
        if (pickerLHP == -1) {
            // All
            setGetMore(true);
            //await fake();
            setGetMore(false);
        } else {
            // getTestWith(SinhVien.MaSV, pickerLHP, quantity, ++page, true)
        }
    }

    // Footer component
    function ListFooterComponent() {
        return (
            getMore ?
                <View style={{ marginBottom: SIZES.padding }}>
                    <ActivityIndicator size='large' color={COLORS.black} />
                </View> : (data == undefined ? (
                    <Text>
                        Không có bài kiểm tra nào đang diễn ra
                    </Text>
                ) : null)

        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            {/** Appbar */}
            <MyAppBar
                title='Bài kiểm tra đang diễn ra'
                leftHandle={() => navigation.goBack()}
                iconRightStyle={{ fontSize: 0 }}
                titleStyle={{ fontSize: 18 }}
                iconLeftStyle={{ marginTop: SIZES.appBarHeight / 6 }}
            />

            {/** Filter */}
            <DialogPickerModal
                data={listTenLHP}
                handle={(item) => classPicker(item)}
                displayValue={listTenLHP[0]} />

            {/** List */}

            {
                !loading ? <FlatList
                    refreshing={refeshing}
                    onRefresh={refeshData}
                    onEndReachedThreshold={0.2}
                    onEndReached={getMoreData}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ItemTest item={item} data={data} handle={handlePressItem} />
                    )}
                    keyExtractor={(item, index) => `${index}_${Math.random()}`}
                    style={{ flex: 1, marginTop: 12, backgroundColor: '#fff' }}
                    ListFooterComponent={ListFooterComponent}
                /> : <LoadingIndicator style={{ marginTop: - SIZES.height * .3 }} />
            }

            {/** Detail */}
            <TestDetailModal
                modalVisible={isShowDialog}
                close={() => {
                    setIsShowDialog(false);
                }}
                data={sentData}
                pressHandle={() => {
                    pressHandleKey();
                }}
            />
        </SafeAreaView>
    );
};
export default StudentTestingList;

