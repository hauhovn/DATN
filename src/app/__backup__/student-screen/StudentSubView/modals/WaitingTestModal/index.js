import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    Modal
} from 'react-native';
//moduns
//
import { AppRouter } from '../../../../../../../navigation/AppRouter';
import { settings } from '../../../../../../../../app/config';
import { MyAppBar } from '../../../app-bar';
//APIs
import { getTestStatus } from '../../../../../../../server/BaiKiemTra/get-status';


export const WaitingTestModal = ({ isVisible, navigation }) => {
    //Consts

    return (
        <Modal
            visible={isVisible}
            style={styles.container}>
            <MyAppBar
                title=""
                leftHandle={() => navigation.goBack()}
                rightHandle={() => navigation.navigate(AppRouter.TESTING, { data: data })}
            />
            <Image
                style={styles.gif}
                source={require('../../../../../../../asset/gif/are-you-there.gif')}
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
                    borderColor: settings.colors.colorGreen,
                }}
            />
            <Text style={styles.title}>CHƯA BẮT ĐẦU</Text>
            <Text style={styles.textContent}>Bài kiểm tra này chưa bắt đầu!</Text>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'column',
        alignItems: 'center',
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
        color: settings.colors.colorMain,
    },
    textContent: {
        marginTop: 2,
    },
});
