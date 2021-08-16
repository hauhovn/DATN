import React from 'react'
import { View, Text, Modal, Image } from 'react-native'

import { GIFS, COLORS } from '../../../assets/constants'

const PauseTestModal = ({ isShow, gifSrc = GIFS.loading_cat, label = 'TẠM DỪNG', content = 'Bài kiểm tra này đã được giám thị dừng lại!' }) => {

    const container = {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(151, 153, 156,0.45)',
    }, box = {
        width: 340,
        height: 240,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
    }, gif = {
        resizeMode: 'cover',
        width: 100,
        height: 100,
        margin: 40,
    }, title = {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: COLORS.colorMain,
    }, textContent = {
        marginTop: 2,
        fontSize: 12,
    }


    return (
        <Modal animationType={'fade'} transparent={true} visible={isShow}>
            <View style={container}>
                <View style={box}>
                    <Image
                        style={gif}
                        source={gifSrc}
                    />
                    <View
                        style={{
                            borderRadius: 60,
                            width: 106,
                            height: 106,
                            marginTop: -150,
                            marginRight: -0.8,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 1,
                            borderColor: COLORS.colorGreen,
                        }}
                    />
                    <Text style={title}>{label}</Text>
                    <Text style={textContent}>
                        {content}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default PauseTestModal
