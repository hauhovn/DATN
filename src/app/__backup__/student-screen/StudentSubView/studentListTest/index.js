import React, { useState, useEffect } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
//modun
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Icon, Picker } from 'native-base';
//item
import { ItemTest } from '../../item-test';
//api
import { getBaiKiemTra } from '../../../../../../../server/BaiKiemTra';
import { teacherEditTest } from '../../../../../../../server/SocketIO';
import { getMiniLopHocPhan } from '../../../../../../../server/LopHP/getListNameLHP';
//settting
import { settings } from '../../../../../../config';
import { AppRouter } from '../../../../../../../app/navigation/AppRouter';
//screens
import { TestDetailModal } from '../modals/TestDetailModal';

export const StudentTestList = ({ navigation, route }) => {
    const nav = useNavigation();
    const fo = useIsFocused();
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [refeshing, setRefeshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState('');
    const [listTenLHP, setListTenLHP] = useState('');

    const [sentData, setSentData] = useState({
        MaBaiKT: '',
        TenBaiKT: '',
        TenSV: ''
    });
    const SinhVien = route.params;

    useEffect(() => {
        teacherEditTest((err, isRemove) => {
            if (err) return;
            if (isRemove != undefined) {
                refeshData();
            }
        });
        loadOption();
    }, []);

    async function loadOption() {
        try {
            await getListLPH();
            await getTests();
            setLoading(false);
        } catch (error) { }
    }

    const getListLPH = async () => {
        let res = await getMiniLopHocPhan(SinhVien.MaSV);
        setListTenLHP(res.data);
        console.log('LIST LHPs: ', res.data);
    };
    const getTests = async () => {
        let res = await getBaiKiemTra(SinhVien.MaSV);
        setData(res);
        console.log('LIST TESTs: ', res);
    };

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
            screen: AppRouter.TESTING_NAV,
            params: {
                screen: AppRouter.TESTING,
                params: { data: sentData },
            },
        });
    };
    async function refeshData() {
        setRefeshing(true);
        await loadOption();
        setRefeshing(false);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.appBar}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Icon
                        type="MaterialIcons"
                        name="keyboard-arrow-left"
                        style={{ color: '#fff', fontSize: 32, marginLeft: 2 }}
                    />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, color: '#fff' }}>
                    DANH SÁCH BÀI KIỂM TRA
                </Text>
                <Text></Text>
            </View>

            <View style={styles.filerBox}>
                <Picker selectedValue={1} mode="dialog" style={styles.picker}>
                    <Picker.Item label="Tất cả" value="0" />
                    {listTenLHP != '' ? (
                        listTenLHP?.map(i => (
                            <Picker.Item label={i.TenLopHP} value={i.MaLopHP} />
                        ))
                    ) : (
                        <Picker label=". . ." />
                    )}
                </Picker>
            </View>

            <FlatList
                refreshing={refeshing}
                onRefresh={refeshData}
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ItemTest item={item} data={data} handle={handlePressItem} />
                )}
                keyExtractor={(item, index) => index}
                style={{ flex: 1, marginTop: 12, backgroundColor: '#fff' }}
            />
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

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: settings.colors.colorMain,
        height: 40,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    filerBox: {
        height: 46,
        width: '100%',
        alignItems: 'flex-end',
        padding: 8,
        backgroundColor: '#b1b4b5',
    },
    picker: {
        height: 42,
        width: '100%',
    },
    textFiler: {},
});
