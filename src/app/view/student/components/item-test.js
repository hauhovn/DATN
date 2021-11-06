import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Moment from 'moment';

import { COLORS } from '../../../assets/constants'

export
    const ItemTest = ({ item, handle }) => {
        return (
            <TouchableOpacity style={styles.container} onPress={() => handle(item)}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>{item.TenLopHP}</Text>
                    <Text style={{ alignSelf: 'flex-end' }}>{Moment(item?.Ngay)?.format('LTS')} - {Moment(item?.Ngay)?.format('L')}</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.content}>
                        <Text>Bài kiểm tra: {item.TenBaiKT}</Text>
                        <Text>Thời gian làm: {item.ThoiGianLam}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        marginHorizontal: '5%',
        marginBottom: 8,
        height: 120,
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
        flexDirection: 'column',
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
    },
    contentText: {},
});
