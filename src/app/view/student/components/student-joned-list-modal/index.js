import React from "react";
import {
    View,
    Modal,
    Text
} from 'react-native';
import { SIZES } from "../../../../assets/constants";


export
    const StudentJonedListModal = ({ isVisible = false }) => {

        return (
            <Modal
                transparent={true}
                visible={isVisible}
                style={{
                    height: SIZES.height,
                    width: SIZES.width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'yellow'
                }}
            >
                <View style={{
                    height: 120,
                    width: 120,
                    backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text>Joned</Text>

                </View>
            </Modal>
        )

    }
