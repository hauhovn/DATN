import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SIZES, STYLES } from '../../../assets/constants'

const TestingDetailItem = ({
    quantityCorrect,
    quantityUncorrect,
    total, style
}) => {

    // const [green] = useState((parseFloat(quantityCorrect)/parseFloat(item.quanlity))*100);
    // const [red] = useState((parseFloat(quantityUncorrect)/parseFloat(item.quanlity))*100);
    // const [yellow] = useState(100 - (green + red));

    console.log(`${quantityCorrect} ${quantityUncorrect}`);

    let green = (parseFloat(quantityCorrect) / parseFloat(total)) * 100;
    let red = (parseFloat(quantityUncorrect) / parseFloat(total)) * 100;
    let yellow = parseFloat(100) - (green + red);
    if (parseFloat(yellow) < 1 || parseFloat(yellow) > 100) {
        yellow = 0;
    }

    console.log(`yellow: ${yellow} ${total} - (${quantityCorrect} + ${quantityUncorrect})`);


    if (green < 3 && green > 0) {
        if (red > 45) {
            red -= 2;

        } else {
            yellow -= 2;
        }
        green += 2;
    }
    if (red < 3 && red > 0) {
        if (yellow > 45) {
            yellow -= 2;

        } else {
            green -= 2;
        }
        red += 2;
    }
    if (yellow < 3 && yellow > 0) {
        if (red > 45) {
            red -= 2;
        } else {
            green -= 2;
        }
        yellow += 2;
    }

    return (
        <View style={styles.container, { width: SIZES.width * .6 }}>
            {/* <Text style={styles.title}>{`item?.name`} {quantityCorrect}/{quantityUncorrect}/{total}</Text> */}
            <View style={styles.box}>
                <View style={{ backgroundColor: COLORS.white, width: 8, height: 32, marginRight: -2 }} />
                <View style={[styles.item,
                {
                    width: `${green}%`,
                    backgroundColor: '#80ff00',

                }
                ]}>
                    <Text style={[styles.number]}>{quantityCorrect}</Text>
                </View>
                <View style={[styles.item, {
                    width: `${red}%`,
                    backgroundColor: '#ff5555',

                }]}>
                    <Text style={styles.number}>{quantityUncorrect}</Text>
                </View>
                <View style={[styles.item,
                {
                    width: `${yellow}%`, backgroundColor: 'yellow',

                }
                ]}>
                    <Text style={styles.number}>{total - quantityCorrect - quantityUncorrect}</Text>
                </View>
                <View style={{ backgroundColor: COLORS.white, width: 8, height: 32, marginRight: -2 }} />
            </View>
            <View style={{ ...styles.coverBox, borderColor: COLORS.white, height: 32 }} />
        </View>
    );
}


export default TestingDetailItem


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 5
    },
    box: {
        flexDirection: 'row',
        width: '90%',
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%',
        borderColor: '#000000',
        marginBottom: -1
    },
    coverBox: {
        width: '92%',
        backgroundColor: 'rgba(0,0,0,0)',
        height: 30,
        borderRadius: 18,
        borderWidth: 5,
        alignSelf: 'center',
        marginTop: -27,
    },

    item: {
        height: 21,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    number: {
        alignSelf: 'center',
        fontSize: 12,
        color: '#000000',
    },

    title: {
        marginLeft: 12,
        marginBottom: 5,
    },

});