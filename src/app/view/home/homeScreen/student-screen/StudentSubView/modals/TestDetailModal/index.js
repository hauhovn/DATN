import React, { useState, useEffect } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import { Icon } from 'native-base';
import Moment from 'moment';

//api
import { getCTBaiKiemTra } from '../../../../../../../../server/BaiKiemTra/getTestDetail';
//colors
import { settings } from '../../../../../../../config';
//css
import { styles, textStyles, inputKeyBox } from './styles';

var mainColor = settings.colors.colorMain;

export const TestDetailModal = ({ modalVisible, close, data, pressHandle }) => {
    const [resData, setResData] = useState(undefined);
    const [keyInput, setKeyInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        loadOption();
    }, [close]);

    async function loadOption() {
        await getResponse();

        setIsLoading(false);
    }

    async function getResponse() {
        const res = await getCTBaiKiemTra(data.MaSV, data.MaBaiKT);
        await setResData(res.data[0]);
        console.log('getResponse: ', resData);
    }

    return (
        <Modal animationType={'fade'} transparent={true} visible={modalVisible}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                close(false);
                            }}>
                            <Icon type="AntDesign" name="close" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    {isLoading ? (
                        <View
                            style={{
                                width: '100%',
                                height: '80%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Image
                                source={require('../../../../../../../asset/gif/loading-3dot.gif')}
                                style={{ height: 80, width: 80 }}
                            />
                        </View>
                    ) : resData != undefined ? (
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                            }}>
                            <View style={styles.title}>
                                <Text style={textStyles.title}>{resData?.TenMonHoc} </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                    <Text
                                        style={[
                                            textStyles.title,
                                            { fontSize: 13, color: mainColor, fontWeight: '200' },
                                        ]}>
                                        Lớp học phần:{' '}
                                    </Text>
                                    <Text
                                        style={[
                                            textStyles.title,
                                            { fontSize: 15, color: mainColor, fontWeight: 'bold' },
                                        ]}>
                                        {resData?.TenLopHP}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.time}>
                                <Text
                                    style={[textStyles.date, { color: settings.colors.colorMain }]}>
                                    {resData?.TenBaiKT}
                                </Text>
                                <Text style={textStyles.date}>
                                    Ngày: {Moment(resData?.Ngay)?.format('L')}
                                </Text>

                                <Text style={textStyles.time}>
                                    Thời gian làm: {resData?.ThoiGianLam}
                                </Text>
                            </View>
                            <View style={inputKeyBox.container}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (resData?.KeyBaiKT == keyInput) {
                                            pressHandle(true);
                                        } else {
                                            Alert.alert('Thông báo', 'Bạn đã nhập sai mã');
                                        }
                                    }}
                                    style={inputKeyBox.box}>
                                    <TextInput
                                        style={inputKeyBox.inputText}
                                        onChangeText={setKeyInput}
                                        placeholder={'Nhập mã tham gia'}
                                    />
                                    <View style={inputKeyBox.button}>
                                        <Text style={inputKeyBox.buttonText}>Tham gia</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.contact}>
                                <Text style={[textStyles.contact, { marginBottom: 1 }]}>
                                    Giảng viên: {resData?.TenGV}
                                </Text>
                                <Text style={textStyles.contact}>Email: {resData?.Mail}</Text>
                            </View>
                        </View>
                    ) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ marginHorizontal: 50, textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', fontSize: 18 }}>Bài kiểm tra này đã kết thúc hoặc bị hủy bỏ</Text>
                    </View>}
                </View>
            </View>
        </Modal>
    );
};
