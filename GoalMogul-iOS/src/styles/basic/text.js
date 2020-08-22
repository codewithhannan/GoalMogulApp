/**
 * Style for text
 *
 * @format
 */

/** Basic text style */
const TEXT_BASE_SIZE = 14 // TODO: this is determined by phone screen ratio and zoom mode
const TEXT_BASE_INCREMENT = 2 // TODO: this is determined by phone screen ratio and zoom mode

export const TEXT_FONT_SIZE = {
    FONT_1: TEXT_BASE_SIZE,
    FONT_2: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT,
    FONT_3: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 2,
    FONT_3_5: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 3,
    FONT_4: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 5,
}

export const TEXT_LINE_HEIGHT = {
    FONT_1: TEXT_BASE_SIZE,
    FONT_2: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT,
    FONT_3: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 2,
    FONT_3_5: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 3,
    FONT_4: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 5,
}

export const FONT_FAMILY = {
    BOLD: 'SFProDisplay-Bold',
    REGULAR: 'SFProDisplay-Regular',
    SEMI_BOLD: 'SFProDisplay-Semibold',
    MEDIUM: 'SFProDisplay-Medium',
}

export const LETTER_SPACING = {
    REGULAR: 0.35,
    WIDE: 0.5,
}
