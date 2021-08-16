import React from 'react'
import { View, Image, Modal } from 'react-native'

import { SIZES, GIFS, COLORS } from '../../../assets/constants'

const LoadingIndicator = ({ style, indicatorStyle, isLoading }) => {
    return (
        <Modal
            transparent={true}
            visible={isLoading}
        >
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.backgroundFade1,
                ...style
            }}>
                <Image source={GIFS.load321}
                    style={{
                        height: SIZES.height * .3, width: SIZES.width * .3,
                        resizeMode: 'contain',
                        ...indicatorStyle
                    }} />
            </View>
        </Modal>
    )
}

export default LoadingIndicator
