import React, {
    useRef,
    useState,
    useEffect
} from 'react';
import {
    View,
    FlatList,
    Text,
    Alert
} from 'react-native';
import { MyAppBar } from '../../components';
import { COLORS, SIZES } from '../../../../assets/constants';
import { DialogPickerModal, LoadingIndicator } from '../../components'
import { getLopHocPhan } from '../../../../../server/student-apis';

const Subjects = ({ navigation, route }) => {

    const [listData, setListData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const SinhVien = route.params;
    const pickerModalData = [{ TenLopHP: 'Chưa hoàn thành' }, { TenLopHP: 'Đã hoàn thành' }]

    const getData = async (isComplete) => {
        console.log(`COMP`, isComplete);
        let res = await getLopHocPhan(SinhVien.MaSV, isComplete);
        res?.data != undefined && setListData(res?.data);
        console.log(listData);
    }


    useEffect(() => { if (listData.length < 1) getData(false) }, [])


    //if (listData.length < 1) _getLopHocPhan(SinhVien.MaSV, false);


    function renderItem(item) {

        const textStyles = { fontSize: 14, padding: SIZES.radius / 4 }

        return (
            <View style={{
                flexDirection: 'column',
                padding: SIZES.padding,
                marginHorizontal: SIZES.padding,
                marginTop: SIZES.padding / 2,
                borderWidth: .6,
                borderRadius: SIZES.radius,
                borderColor: COLORS.colorMain,
                backgroundColor: COLORS.white
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: SIZES.radius / 2,
                    alignSelf: 'center'
                }}>{item.TenLopHP}</Text>
                <Text style={{ ...textStyles }}>Môn học: {item.TenMonHoc}</Text>
                <Text style={{ ...textStyles }}>Giảng viên: {item.TenGV}</Text>
                <Text style={{ ...textStyles }}>Số tín chỉ: {item?.SoTinChi}</Text>
                <Text style={{ ...textStyles }}>Số tiết: {item?.SoTiet}</Text>
            </View>
        )
    }

    const pickerHandle = async (item) => {

        await setLoading(true);
        await setListData([]);

        if (item == pickerModalData[0]) {
            await getData(false)
        } else {
            await getData(true)
        }
        await setLoading(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <MyAppBar
                leftHandle={() => { navigation.goBack(); console.log(1); }}
                title="Lớp học phần"
                iconRightStyle={{
                    width: 0,
                    height: 0
                }}
            />
            <DialogPickerModal
                data={pickerModalData}
                addAllItem={false}
                handle={(item) => pickerHandle(item)}
                displayValue={pickerModalData[0]}
            />
            <LoadingIndicator isLoading={isLoading} />
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ width: SIZES.width, height: SIZES.height }}
                    data={listData}
                    keyExtractor={item => item.MaLopHP}
                    renderItem={data => renderItem(data.item)}
                />
            </View>
        </View>
    );
};


export default Subjects;