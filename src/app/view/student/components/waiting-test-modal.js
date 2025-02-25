import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

// Constants
import { COLORS, GIFS, SIZES } from '../../../assets/constants';

export const WaitingTest = () => {
    //Consts

    return (
        <View style={styles.container}>
            <Image
                style={styles.gif}
                source={GIFS.doremon_are_you_there}
            />
            <View
                style={{
                    borderRadius: 60,
                    width: 106,
                    height: 106,
                    marginTop: -150,
                    marginRight: -0.8,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: COLORS.colorGreen,
                }}
            />
            <Text style={styles.title}>CHƯA BẮT ĐẦU</Text>
            <Text style={styles.textContent}>Bài kiểm tra này chưa bắt đầu!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0.2 * SIZES.height
    },

    gif: {
        resizeMode: 'cover',
        width: 120,
        height: 120,
        margin: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: COLORS.colorMain,
    },
    textContent: {
        marginTop: 2,
    },
});
