import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

// Constants
import { COLORS, SIZES, STYLES } from '../../../assets/constants'

export
    const MyAppBar = ({
        title = 'Title',
        leftIconName = 'chevron-back-outline',
        leftIconType = 'Ionicons',
        rightIconName = 'info',
        rightIconType = 'Entypo',
        style,
        iconRightStyle,
        iconLeftStyle,
        titleStyle,
        leftHandle,
        rightHandle,
    }) => {

        return (
            <View style={{ ...styles.container, ...style }}>
                <TouchableOpacity onPress={leftHandle}>
                    <Icon
                        type={leftIconType}
                        name={leftIconName}
                        style={{ ...STYLES.icon3, ...iconLeftStyle }}
                    />
                </TouchableOpacity>
                <Text style={{ ...styles.title, ...titleStyle }}>{title}</Text>
                <TouchableOpacity onPress={rightHandle} >
                    <Icon
                        type={rightIconType}
                        name={rightIconName}
                        style={{ ...STYLES.icon4, ...iconRightStyle }}
                    />
                </TouchableOpacity>
            </View >
        );
    };

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0, right: 0,
        height: SIZES.appBarHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.colorMain,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    },
    items: {
        marginHorizontal: 5,
    },
    leftIcon: {
        fontSize: 24,
    },
    rightIcon: {
        fontSize: 19,
        alignSelf: 'center'
    },
    title: {
        color: COLORS.white,
        fontSize: 19,
        fontWeight: 'bold',
    },
});
