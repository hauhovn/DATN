import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Moment from 'moment';

import { COLORS, SIZES } from '../../../assets/constants'
import { getSoCauDung, getCTBaiKiemTra } from '../../../../server/student-apis'

export
    const ItemTestResult = ({ item, handle, MaSV }) => {

        const [soCauDung, setSoCauDung] = useState(-1);
        const [soCauHoi, setSoCauHoi] = useState(0);
        const [gv, setGv] = useState('');
        const [mail, setMail] = useState('');

        const getResult = async () => {
            const rs = await getSoCauDung(MaSV, item?.MaBaiKT);
            console.log(`rs ch vui: `, rs);
            setSoCauDung(rs?.data?.SoCauDung)
            getDetailt();
        }

        const getDetailt = async () => {
            const rs = await getCTBaiKiemTra(MaSV, item?.MaBaiKT);
            console.log(`ItemTestResult: `, rs);
            setSoCauHoi(rs?.data?.SoLuongCauHoi)
            setGv(rs?.data?.TenGV)
            setMail(rs?.data?.Mail)
        }

        const caculator = () => {
            try {
                let math = parseFloat(((soCauDung / soCauHoi) * 10)).toFixed(2);
                if (Number.isNaN(parseFloat(math))) math = '0.00';
                return math
            } catch (error) {
                return '0.00'
            }
        }

        soCauDung == -1 && getResult();


        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{item.TenLopHP}</Text>
                    <Text>{Moment(item?.Ngay)?.format('LTS')} - {Moment(item?.Ngay)?.format('L')}</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.content}>
                        <Text>Bài kiểm tra: {item.TenBaiKT}</Text>
                        <Text>Thời gian làm: {item.ThoiGianLam}</Text>
                        <Text>Giảng viên: {gv}</Text>
                        <Text>Liên hệ: {mail}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <View
                        style={{
                            ...styles.content,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text
                            style={{ fontWeight: '900', fontSize: 16, color: COLORS.colorMain }}>
                            Kết quả: {caculator()} điểm ({soCauDung}/{soCauHoi})
                        </Text>
                        <TouchableOpacity
                            disabled={item?.ChoXemKetQua > 0 ? false : true}
                            onPress={() => handle(item)}
                            style={{
                                backgroundColor: item?.ChoXemKetQua > 0 ? COLORS.colorMain : COLORS.gray,
                                paddingHorizontal: SIZES.radius,
                                paddingVertical: SIZES.radius / 2,
                                borderRadius: SIZES.radius,
                                marginTop: -SIZES.radius
                            }}
                        >
                            <Text
                                style={{ fontSize: 12, color: COLORS.white, textTransform: 'capitalize' }}
                            >Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        marginHorizontal: '5%',
        marginBottom: 8,
        width: '90%',
        borderWidth: 0.6,
        borderColor: COLORS.colorMain,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 5,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
    },
    content: {
        flexDirection: 'column',
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.green
    },
    contentText: {},
});
