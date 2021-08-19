import React from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Icon } from 'native-base';

// Constants
import { COLORS, SIZES, STYLES } from '../../../assets/constants'

const DialogPickerModal = ({ data, handle, style, displayValue }) => {

    const [show, setShow] = React.useState(false);
    const _data = [{ MaLopHP: -1, TenLopHP: 'Tất cả' }, ...data,]

    const pressHandle = (item) => {
        setShow(!show);
        handle(item);
    }

    function renderItem(item) {
        return (
            <View style={{
                borderBottomColor: COLORS.black,
                borderBottomWidth: .3, marginHorizontal: SIZES.width * .1
            }}>
                <TouchableOpacity
                    onPress={() => pressHandle(item)}
                    style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ padding: SIZES.base, fontSize: 14, fontWeight: 'bold', }}>{item.TenLopHP}</Text>
                </TouchableOpacity>
            </View>

        );
    }

    return (
        <View >

            {/** Show button */}
            <View style={{ backgroundColor: COLORS.white }}>
                <TouchableOpacity
                    onPress={() => setShow(!show)}
                    style={{
                        flexDirection: 'row',
                        marginTop: SIZES.base,
                        alignSelf: 'flex-end',
                    }}
                >
                    <Text style={{
                        marginHorizontal: SIZES.padding,
                        fontSize: 16, alignSelf: 'center'
                    }}>
                        {displayValue?.TenLopHP}</Text>
                    <Icon type='MaterialCommunityIcons' name='filter-menu'
                        style={{ marginHorizontal: SIZES.padding, fontSize: 20 }} />

                </TouchableOpacity>
            </View>

            {/** Modal show */}
            <Modal
                onRequestClose={() => setShow(!show)}
                visible={show}
                animationType="fade"
                transparent={true}
            >

                <View style={{
                    flex: 1, backgroundColor: COLORS.backgroundFade,
                    alignItems: 'center', justifyContent: 'center',
                    ...style,

                }}>
                    <View style={{
                        ...STYLES.shadow,
                        width: SIZES.width * .8, minHeight: SIZES.height * .2,
                        maxHeight: SIZES.height * .5, backgroundColor: COLORS.white,
                        marginTop: -SIZES.height * .1, borderRadius: SIZES.radius
                    }}>

                        {/** Space */}
                        <View style={{ height: SIZES.padding }} />

                        {/** List */}
                        {true ? (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={_data}
                                keyExtractor={(item, index) => index}
                                renderItem={data => renderItem(data.item)}
                            />
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text >Không tìm thấy giá trị nào</Text>
                            </View>
                        )}

                        {/** Close button */}
                        <TouchableOpacity
                            onPress={() => setShow(!show)}
                            style={{ padding: SIZES.base, alignItems: 'center' }}
                        >
                            <Icon type='FontAwesome' name='close' style={{ color: COLORS.colorMain, fontSize: 24 }} />
                        </TouchableOpacity>

                    </View>
                </View>


            </Modal>
        </View>

    )
}

export default DialogPickerModal
