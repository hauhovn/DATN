import { Alert } from 'react-native'

const MyAlert = ({ title, content, handle }) => {
    return (

        Alert.alert(title, content, [
            {
                text: "Trở lại",
                onPress: () => null,
                style: "cancel"
            },
            {
                text: "Đồng ý",
                onPress: () => {
                    handle(true)
                }
            }
        ])
    );

}
export default MyAlert
