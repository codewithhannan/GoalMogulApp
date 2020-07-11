/**
 * Style for text
 */

/** Basic text style */
export const TEXT_BASE_SIZE = 14; // TODO: this is determined by phone screen ratio and zoom mode
export const TEXT_BASE_INCREMENT = 2; // TODO: this is determined by phone screen ratio and zoom mode

export const TEXT_FONT_SIZE = {
  FONT_1: TEXT_BASE_SIZE,
  FONT_2: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT,
  FONT_3: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 2,
  FONT_3_5: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 3,
  FONT_4: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 5,
};

export const TEXT_LINE_HEIGHT = {
  FONT_1: TEXT_BASE_SIZE,
  FONT_2: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT,
  FONT_3: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 2,
  FONT_3_5: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 3,
  FONT_4: TEXT_BASE_SIZE + TEXT_BASE_INCREMENT * 5,
};

export const TEXT_FONT_FAMILY = {
  default: {
    GOTHAM_BOLD: "gotham-pro-bold",
    GOTHAM: "gotham-pro",
  },
};
