/** @format */

import * as text from './text'
import * as color from './color'
import * as button from './button'
import * as card from './card'
import { UI_SCALE } from '..'

export { text, color, button, card }

export const default_style = {
    // Headers
    titleText_1: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 17 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        fontWeight: 'bold',
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    titleText_2: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 14 * UI_SCALE,
        fontWeight: 'bold',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.REGULAR,
    },
    subTitleText_1: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 16 * UI_SCALE,
        fontWeight: '400',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    goalTitleText_1: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 19 * UI_SCALE,
        fontWeight: '400',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    // Normal texts
    normalText_1: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 15 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        fontWeight: '500',
        lineHeight: 19,
        letterSpacing: text.LETTER_SPACING.REGULAR,
    },
    normalText_2: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 12 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        fontWeight: '500',
        letterSpacing: text.LETTER_SPACING.REGULAR,
    },
    normalIcon_1: {
        height: 16 * UI_SCALE,
        width: 16 * UI_SCALE,
    },
    // Detailing texts
    smallTitle_1: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 11 * UI_SCALE,
        fontWeight: 'bold',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    smallText_1: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 11 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    smallText_2: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        fontSize: 10 * UI_SCALE,
        color: color.TEXT_COLOR.OFF_DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    smallIcon_1: {
        height: 13 * UI_SCALE,
        width: 13 * UI_SCALE,
    },
    // Button styles
    buttonText_1: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: 15 * UI_SCALE,
        fontWeight: '700',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    buttonText_2: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: 12 * UI_SCALE,
        fontWeight: '700',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.REGULAR,
    },
    buttonIcon_1: {
        height: 24 * UI_SCALE,
        width: 24 * UI_SCALE,
        tintColor: color.TEXT_COLOR.DARK,
    },
    // Misc
    uiScale: UI_SCALE,
    infoIcon: {
        height: 8 * UI_SCALE,
        width: 8 * UI_SCALE,
        tintColor: color.TEXT_COLOR.DARK,
    },
    priortyBar: {
        height: 4 * UI_SCALE,
        width: 30 * UI_SCALE,
        marginTop: 4 * UI_SCALE,
    },
    profileImage_1: {
        height: 42 * UI_SCALE,
        width: 42 * UI_SCALE,
        borderRadius: 21 * UI_SCALE,
    },
    profileImage_2: {
        height: 20 * UI_SCALE,
        width: 20 * UI_SCALE,
        margin: 10 * UI_SCALE,
    },
    defaultImageStyle: {
        borderColor: '#cacaca',
        borderWidth: 0.5,
    },
    cardHorizontalSeparator: {
        alignSelf: 'center',
        width: '95%',
        backgroundColor: color.GM_LIGHT_GRAY,
        height: 1,
    },
    cardVerticalSeparator: {
        height: '75%',
        width: 1,
        backgroundColor: color.GM_LIGHT_GRAY,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
}
