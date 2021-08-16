import { Dimensions } from "react-native"
const { width, height } = Dimensions.get('window');

const SIZES = {
    radius: 12,
    appBarHeight: 36,
    base: 8,
    padding: 24
}

export default { width, height, ...SIZES }