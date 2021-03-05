/** @format */

import { StyleSheet } from 'react-native'
import { UI_SCALE } from '..'
import { default_style, color } from '../basic'

export const chat_style = {
    headerDefaultIcon: {
        height: 16 * UI_SCALE,
        width: 16 * UI_SCALE,
    },
    headerDefaultIconContainer: {
        // same as default_style.buttonIcon_1 without tintColor
        ...default_style.buttonIcon_1,
        tintColor: null,
        borderRadius: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    chatMessageTextStyle: {
        ...default_style.subTitleText_1,
        color: color.TEXT_COLOR.OFF_DARK,
    },
}
