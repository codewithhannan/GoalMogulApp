/** @format */

import { default_style, color, text } from '../basic'
import { UI_SCALE } from '..'

export const PROFILE_STYLES = {
    nameTitle: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 21 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        fontWeight: 'bold',
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
    aboutInfoTitle: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 18 * UI_SCALE,
        fontWeight: '400',
        color: color.TEXT_COLOR.DARK,
        letterSpacing: text.LETTER_SPACING.WIDE,
    },
}
