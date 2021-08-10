import React from 'react'
import { View, Text } from 'react-native'

import CountDown from 'react-native-countdown-component';

import { COLORS } from '../../../assets/constants'

const MyCountDown = ({ title, time, isRuning }) => {
    return (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.colorMain,
            }}>{title}</Text>
            <CountDown
                size={16}
                until={time}
                running={isRuning}
                onFinish={() => { }}
                digitStyle={{
                    backgroundColor: 'rgba(76, 175, 80,0)',
                    borderWidth: 0,
                    borderColor: 'blue',
                }}
                digitTxtStyle={{ color: COLORS.colorMain }}
                timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                separatorStyle={{ color: COLORS.colorMain }} // mau` dau :
                timeToShow={['H', 'M', 'S']}
                timeLabels={{ m: null, s: null }}
                showSeparator
            />
        </View>
    )
}

export default MyCountDown;
