import { COLORS, SIZES } from '../constants';

const pub = {
    //tintColor: COLORS.white,
    color: COLORS.white,
    // resizeMode: 'contain',
};

const shadow = {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    backgroundColor: COLORS.white
}

export const STYLES = {

    /** Icons */
    icon1: {
        ...pub,
        width: 64,
        height: 64,
    },
    icon2: {
        ...pub,
        width: 42,
        height: 42,
    },
    icon3: {
        ...pub,
        width: 36,
        height: 36,
    },
    icon4: {
        ...pub,
        width: 28,
        height: 28,
    },

    /** Shadows */
    shadow: {
        ...shadow,
    },

    /** Appbar */
    appBar: {
        marginHorizontal: SIZES.radius,
        borderBottomLeftRadius: SIZES.radius,
        borderBottomRightRadius: SIZES.radius,
        ...shadow,
    }
}
