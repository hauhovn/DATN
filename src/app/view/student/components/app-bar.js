import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

// Constants
import { COLORS, SIZES, STYLES } from '../../../assets/constants'

export
    const MyAppBar = ({
        title = 'Title',
        leftIconName = 'chevron-back',
        leftIconType = 'Ionicons',
        rightIconName = 'info',
        rightIconType = 'Entypo',
        style,
        iconRightStyle,
        iconLeftStyle,
        titleStyle,
        leftHandle,
        rightHandle,
        child
    }) => {

        return (
            <View style={{
                ...STYLES.shadow,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 64,
                marginHorizontal: SIZES.radius / 2,
                borderBottomLeftRadius: SIZES.radius,
                borderBottomRightRadius: SIZES.radius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                elevation: 6,
                backgroundColor: COLORS.white,
                ...style
            }}>
                <TouchableOpacity onPress={leftHandle}>
                    <Icon
                        type={leftIconType}
                        name={leftIconName}
                        style={{
                            ...STYLES.icon3,
                            marginLeft: SIZES.radius,
                            color: COLORS.colorMain,
                            ...iconLeftStyle
                        }}
                    />
                </TouchableOpacity>
                <View>
                    {child ? child :
                        <Text style={{
                            fontSize: 18,
                            color: COLORS.colorMain,
                            textTransform: 'capitalize',
                            ...titleStyle,
                        }}>{title}</Text>
                    }
                </View>
                <TouchableOpacity onPress={rightHandle} >
                    <Icon
                        type={rightIconType}
                        name={rightIconName}
                        style={{
                            ...STYLES.icon4,
                            marginRight: SIZES.radius,
                            color: COLORS.colorMain,
                            ...iconRightStyle
                        }}
                    />
                </TouchableOpacity>
            </View >
        );
    };
