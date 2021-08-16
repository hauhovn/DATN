import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';

// Constants
import { COLORS, SIZES, STYLES } from '../../../../assets/constants'

export const ItemQuestion = ({ item, handle }) => {
    const pressItem = () => {
        handle(item.STT);
    };
    let itemColor = COLORS.colorMain;
    if (item?.DASV == 'X' || item?.DASV == 'X') {
        itemColor = COLORS.colorGreen;
    } else if (item?.DapAn != undefined) {
        if (item?.DapAn != item?.DASV) {
            // incorrect
            itemColor = COLORS.colorRed;
        } else {
            itemColor = COLORS.colorGreen;
        }
    } else {
        itemColor = COLORS.colorMain;
    }

    return (
        <View
            style={{
                ...STYLES.shadow,
                height: SIZES.padding * 2,
                width: SIZES.padding * 2,
                margin: SIZES.base,
                backgroundColor: itemColor,
                borderRadius: SIZES.radius,
                justifyContent: 'center'
            }}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    pressItem();
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: COLORS.white,
                        textAlign: 'center',
                        textTransform: 'uppercase'
                    }}>
                    {item?.STT}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {},
});
