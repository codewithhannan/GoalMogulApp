/** @format */

import text from './text'
import color from './color'
import button from './button'
import card from './card'

export { text, color, button, card }

const UI_SCALE = 1
export const TEXT_COLOR_1 = '#333'

export const FONT_FAMILY_1 = 'gotham-pro-bold'
export const FONT_FAMILY_2 = 'gotham-pro'
export const FONT_FAMILY_3 = 'Helvetica'

export const DEFAULT_STYLE = {
    // Headers
    titleText_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 16 * UI_SCALE,
        color: TEXT_COLOR_1,
        letterSpacing: 0.3,
    },
    titleText_2: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 14 * UI_SCALE,
        color: TEXT_COLOR_1,
    },
    subTitleText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 16 * UI_SCALE,
        color: TEXT_COLOR_1,
        letterSpacing: 0.3,
    },
    // Normal texts
    normalText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 14 * UI_SCALE,
        color: TEXT_COLOR_1,
    },
    // Detailing texts
    smallTitle_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 12 * UI_SCALE,
        color: TEXT_COLOR_1,
        letterSpacing: 0.7,
    },
    smallText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 11 * UI_SCALE,
        color: TEXT_COLOR_1,
    },
    smallText_2: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 9 * UI_SCALE,
        color: TEXT_COLOR_1,
    },
    smallIcon_1: {
        height: 12 * UI_SCALE,
        width: 12 * UI_SCALE,
    },
    // Button styles
    buttonText_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 14 * UI_SCALE,
    },
    buttonIcon_1: {
        height: 16 * UI_SCALE,
        width: 16 * UI_SCALE,
        borderRadius: 8 * UI_SCALE,
    },
    // Misc
    infoIcon: {
        height: 9 * UI_SCALE,
        width: 5 * UI_SCALE,
        tintColor: TEXT_COLOR_1,
    },
    priortyBar: {
        height: 4 * UI_SCALE,
        width: 30 * UI_SCALE,
        marginTop: 4 * UI_SCALE,
    },
    profileImage_1: {
        height: 60 * UI_SCALE,
        width: 60 * UI_SCALE,
        borderRadius: 30 * UI_SCALE,
    },
    profileImage_2: {
        height: 20 * UI_SCALE,
        width: 20 * UI_SCALE,
        margin: 20 * UI_SCALE,
    },
}
