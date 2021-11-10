import React from "react";
import {
    View,
    Modal,
    Text,
    FlatList
} from 'react-native';
import { COLORS, SIZES } from "../../../../assets/constants";
import { getJonedList } from '../../../../../server'

export
    const StudentJonedListModal = ({ isVisible = false, closePopup, props }) => {

        const getData = async () => {
            if (data.length > 0) return;
            console.log(`props ne: `, props);
            const rs = await getJonedList(props.MaGV, props.MaBaiKT);
            console.log(rs);
            await setData(rs.data);

        }

        const [data, setData] = React.useState([]);

        getData();

        function renderItem(item) {
            console.log(item);
            return (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: COLORS.colorBoderLight,
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.padding / 2,
                    borderRadius: SIZES.radius,
                    marginTop: SIZES.radius
                }}>
                    <Text style={{ fontSize: 16 }}>{item.TenSV} </Text>
                    <Text style={{ fontSize: 16, color: item.Joned == 'true' ? COLORS.green : COLORS.colorRed }}> {item.Joned == 'true' ? 'Đã tham gia' : 'Chưa tham gia'}</Text>
                </View>
            )
        }

        return (
            <Modal
                transparent={true}
                visible={isVisible}
                onRequestClose={closePopup}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'yellow'
                }}
            >
                <View style={{
                    height: SIZES.height,
                    width: SIZES.width,
                    backgroundColor: COLORS.backgroundFade,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center'
                }}>
                    <FlatList
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            marginTop: SIZES.height * .27,
                            width: SIZES.width * .9
                        }}
                        data={data}
                        keyExtractor={item => item.MaSV}
                        renderItem={(item) => renderItem(item.item)}
                    />
                </View>
            </Modal>
        )

    }
