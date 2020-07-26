/** @format */

import { Platform } from 'react-native'

import { DEFAULT_STYLE, GM_BLUE, GM_BLUE_LIGHT_LIGHT, FONT_FAMILY_3 } from '..'
import { IPHONE_MODELS, DEVICE_MODEL } from '../../Utils/Constants'

export const CONTENT_COLOR = 'white'
export const PADDING_TOP =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 25 : 40

export const HEADER_STYLES = {
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: GM_BLUE,
        height: 87 * DEFAULT_STYLE.uiScale,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: 'center',
        paddingTop: PADDING_TOP,
    },
    nakedButton: {
        height: 30,
        width: 30,
        tintColor: CONTENT_COLOR,
    },
    button: DEFAULT_STYLE.buttonIcon_1,
    buttonWrapper: {
        padding: 6,
        borderRadius: 100,
        backgroundColor: GM_BLUE_LIGHT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...DEFAULT_STYLE.titleText_1,
        color: CONTENT_COLOR,
    },
    buttonText: {
        ...DEFAULT_STYLE.subTitleText_1,
        fontFamily: FONT_FAMILY_3,
        fontWight: '700',
        color: CONTENT_COLOR,
    },
    logo: {
        width: 130 * DEFAULT_STYLE.uiScale,
        tintColor: CONTENT_COLOR,
    },
}
