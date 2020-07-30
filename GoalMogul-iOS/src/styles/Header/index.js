/** @format */
import { default_style, color, text } from '../basic'

export const CONTENT_COLOR = 'white'

export const HEADER_STYLES = {
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: color.GM_BLUE,
        height: 47 * default_style.uiScale,
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
        fontWight: '700',
        color: CONTENT_COLOR,
    },
    logo: {
        width: 130 * default_style.uiScale,
        tintColor: CONTENT_COLOR,
    },
}
