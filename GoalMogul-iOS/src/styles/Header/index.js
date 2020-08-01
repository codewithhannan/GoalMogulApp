/** @format */
import { default_style, color, text } from '../basic'
import { IS_SMALL_PHONE } from '..'

export const CONTENT_COLOR = 'white'

export const HEADER_STYLES = {
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: color.GM_BLUE,
        height: (IS_SMALL_PHONE ? 70 : 90) * default_style.uiScale,
        paddingTop: IS_SMALL_PHONE ? 20 : 40,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
    },
    nakedButton: {
        height: 30,
        width: 30,
        tintColor: CONTENT_COLOR,
    },
    button: default_style.buttonIcon_1,
    buttonWrapper: {
        padding: 6,
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
        tintColor: CONTENT_COLOR,
    },
}
