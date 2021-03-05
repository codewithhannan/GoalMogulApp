/**
 * GM V2 card style
 *
 * @format
 */

export const CARD_PADDING_BASE = 16 // TODO: this is determined by phone screen ratio and zoom mode
export const CARD_PADDING_INCREMENT = 2 // TODO: this is determined by phone screen ratio and zoom mode
export const CARD_MARGIN_BASE = 10 // TODO: this is determined by phone screen ratio and zoom mode
export const CARD_MARGIN_INCREMENT = 2 // TODO: this is determined by phone screen ratio and zoom mode

export const CARD_PADDING = {
    CARD_PADDING_1: CARD_PADDING_BASE,
    CARD_PADDING_2: CARD_PADDING_BASE + CARD_PADDING_INCREMENT,
    CARD_PADDING_3: CARD_PADDING_BASE + CARD_PADDING_INCREMENT * 2,
    CARD_PADDING_4: CARD_PADDING_BASE + CARD_PADDING_INCREMENT * 3,
}

export const CARD_MARGIN = {
    CARD_MARGIN_1: CARD_MARGIN_BASE,
    CARD_MARGIN_2: CARD_MARGIN_BASE + CARD_MARGIN_INCREMENT,
    CARD_MARGIN_3: CARD_MARGIN_BASE + CARD_MARGIN_INCREMENT * 2,
    CARD_MARGIN_4: CARD_MARGIN_BASE + CARD_MARGIN_INCREMENT * 3,
}
