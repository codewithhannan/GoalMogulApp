/** @format */
import { default_style, color, text } from '../basic'
import { IS_SMALL_PHONE } from '..'
import { Platform } from 'react-native'

export const CONTENT_COLOR = 'white'
export const SMALL_PHONE_HEIGHT = Platform.select({
    ios: 70,
    android: 76,
    default: 70,
})
export const SMALL_PHONE_PADDING_TOP = Platform.select({
    ios: 20,
    android: 23,
    default: 20,
})

export const HEADER_STYLES = {
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: color.GM_BLUE,
        height:
            (IS_SMALL_PHONE ? SMALL_PHONE_HEIGHT : 90) * default_style.uiScale,
        paddingTop: IS_SMALL_PHONE ? SMALL_PHONE_PADDING_TOP : 40,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    nakedButton: {
        height: 30 * default_style.uiScale,
        width: 30 * default_style.uiScale,
        tintColor: CONTENT_COLOR,
    },
    button: default_style.buttonIcon_1,
    buttonWrapper: {
        padding: 6 * default_style.uiScale,
        borderRadius: 100,
        backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...default_style.titleText_1,
        color: CONTENT_COLOR,
    },
    buttonText: {
        ...default_style.subTitleText_1,
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontWeight: '700',
        color: CONTENT_COLOR,
    },
    logo: {
        width: 130 * default_style.uiScale,
        height: 30 * default_style.uiScale,
        tintColor: CONTENT_COLOR,
    },
}
