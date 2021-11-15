import React, { useState, useEffect } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    FlatList,
} from 'react-native';
import { Icon } from 'native-base';
//views
import { ItemQuestion } from './item';

// Constants
import { COLORS, SIZES, STYLES } from '../../../../assets/constants'
import { useFocusEffect } from '@react-navigation/native';

export const MenuQuestionModal = ({ isVisible, onRequestClose, data, onPressItem, isTest = true }) => {

    let isCheck = {
        //is check or correct
        label: 'Đã làm',
        color: COLORS.colorMain,
    },
        unCheck = {
            // or incorrect
            label: 'Chưa làm',
            color: COLORS.colorGreen,
        };
    if (data[0]?.DapAn != undefined) {
        // is test result
        isCheck.color = COLORS.colorGreen;
        isCheck.label = 'Đúng';

        unCheck.color = COLORS.colorRed;
        unCheck.label = 'Sai';
    }

    const [slDaLam, setSL] = React.useState(0);

    const soCauDaLam = () => {
        let sl = 0;
        data.forEach(element => {
            console.log(`element`, element);
            if (element.DASV != 'X' || element.DASV != 'X') sl++;
        });
        setSL(sl);
    }

    React.useEffect(() => {
        isVisible && soCauDaLam()
    }, [isVisible])

    //funcs
    const handlePressItem = item => {
        onPressItem(item);
        onRequestClose();
    };

    return (
        <Modal visible={isVisible}
            animationType='slide'>
            <View style={{ flex: 1 }}>

                {/** Appbar */}
                <View style={{
                    ...STYLES.appBar, flexDirection: 'row',
                    height: 46, marginTop: SIZES.radius,
                    borderRadius: SIZES.radius, alignItems: 'center',
                    justifyContent: 'space-between', marginHorizontal: SIZES.padding
                }}>
                    <View />
                    <Text style={{
                        textTransform: 'uppercase',
                        fontSize: 14,
                        color: COLORS.colorMain,
                        fontWeight: 'bold',
                        marginLeft: SIZES.padding
                    }}>Danh sách câu hỏi</Text>
                    <TouchableOpacity
                        onPress={() => {
                            onRequestClose(false);
                        }}>
                        <Icon
                            type="FontAwesome"
                            name="close"
                            style={{ fontSize: 26, color: COLORS.colorMain, marginRight: SIZES.padding }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 46,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                ...STYLES.shadow,
                                height: SIZES.width / 10 - 12,
                                width: SIZES.width / 10 - 12,
                                borderRadius: 10,
                                backgroundColor: isCheck.color,
                                borderWidth: 1,
                                borderColor: '#CFD8DC',
                            }}
                        />
                        <Text style={myStyles.textTur}>{isCheck.label}</Text>
                    </View>
                    {data[0]?.DapAn != undefined && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    ...STYLES.shadow,
                                    height: SIZES.width / 10 - 12,
                                    width: SIZES.width / 10 - 12,
                                    borderRadius: 10,
                                    backgroundColor: COLORS.black,
                                    borderWidth: 1,
                                    borderColor: '#CFD8DC',
                                }}
                            />
                            <Text style={myStyles.textTur}>Chưa làm</Text>
                        </View>
                    )}
                    {
                        !isTest && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    ...STYLES.shadow,
                                    height: SIZES.width / 10 - 12,
                                    width: SIZES.width / 10 - 12,
                                    borderRadius: 10,
                                    backgroundColor: unCheck.color,
                                    borderWidth: 1,
                                    borderColor: '#CFD8DC',
                                }}
                            />
                            <Text style={myStyles.textTur}>{unCheck.label}</Text>
                        </View>
                    }
                </View>
                <View
                    style={{
                        flex: 1,
                        margin: '2%',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                    {isTest && <Text style={{ fontSize: 12 }}>( Đã làm {slDaLam}/{data?.length} )</Text>}
                    <FlatList
                        data={data}
                        numColumns={Math.round(SIZES.width / (2 * SIZES.padding + SIZES.base))}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ItemQuestion
                                item={item}
                                data={data}
                                handle={handlePressItem}
                                showFail={isTest ? false : true}
                            />
                        )}
                        keyExtractor={item => item.id}
                        style={{ flex: 1, paddingTop: 10 }}
                    />
                </View>
            </View>
        </Modal >
    );
};

const myStyles = StyleSheet.create({
    textTur: {
        marginLeft: 10,
        fontSize: 16,
    },
});
