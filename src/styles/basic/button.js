/**
 * Style for button
 *
 * @format
 */

/** Basic button style */
export const BUTTON_BORDER_RADIUS_BASE = 5 // TODO: this is determined by phone screen ratio and zoom mode
export const BUTTON_BORDER_REDIUS_INCREMENT = 2 // TODO: this is determined by phone screen ratio and zoom mode

export const BUTTON_BORDER_RADIUS = {
    RADIUS_1: BUTTON_BORDER_RADIUS_BASE,
    RADIUS_2: BUTTON_BORDER_RADIUS_BASE + BUTTON_BORDER_REDIUS_INCREMENT,
    RADIUS_3: BUTTON_BORDER_RADIUS_BASE + BUTTON_BORDER_REDIUS_INCREMENT * 2,
    RADIUS_4: BUTTON_BORDER_RADIUS_BASE + BUTTON_BORDER_REDIUS_INCREMENT * 3,
}
