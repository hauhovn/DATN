import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Constants
import { COLORS } from '../../../../assets/constants'

export const ItemQuestion = ({ item, handle }) => {
    const pressItem = () => {
        handle(item.STT);
    };
    const { width, height } = Dimensions.get('window');
    let itemColor = COLORS.colorMain;
    if (item?.DASV == 'X') {
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
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
                pressItem();
            }}
            style={{
                height: width / 7,
                width: width / 7,
                marginHorizontal: 10,
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 5,
                borderRadius: 10,
                backgroundColor: itemColor,
                borderWidth: 1,
                borderColor: '#CFD8DC',
            }}>
            <Text
                style={{
                    flex: 10,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                }}>
                {item?.STT}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    icon: {},
});
