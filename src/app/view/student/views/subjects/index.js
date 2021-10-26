import React, {
    useRef,
    useState
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { MyAppBar } from '../../components';
import { SIZES } from '../../../../assets/constants';

const Subjects = ({ navigation }) => {

    const colorActive = ['black', 'red'];
    const tabsName = ['Chưa hoàn thành', 'Đã hoàn thành']
    const [isCompletedTabActived, setComplete] = useState(true);
    const completedTab = useRef(new Animated.Value(0)).current;

    return (
        <View>
            <MyAppBar
                leftHandle={() => { navigation.goBack(); console.log(1); }}
                title="Lớp học phần"
                iconRightStyle={{
                    width: 0,
                    height: 0
                }}
            />

            {/** Navi tabs */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: SIZES.padding
            }}>
                <TouchableOpacity
                    onPress={() => setComplete(!isCompletedTabActived && true)}
                >
                    <Text style={{
                        color: isCompletedTabActived ? colorActive[1] : colorActive[0]
                    }}>{tabsName[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setComplete(isCompletedTabActived && false)}
                >
                    <Text style={{
                        color: isCompletedTabActived ? colorActive[0] : colorActive[1]
                    }}>{tabsName[1]}</Text>
                </TouchableOpacity>
            </View>

            {/** Content tabs */}
            <View>
                {/** Completed tab */}
                <View style={{ backgroundColor: 'red', flex: 1 }}>
                    <Text>123</Text>
                </View>
            </View>
        </View>
    );
};

const CompleteSubjects = () => {
    return <View><Text>Comp</Text></View>
}
const UncompleteSubjects = () => {
    return <View><Text>123Comp</Text></View>
}


export default Subjects;