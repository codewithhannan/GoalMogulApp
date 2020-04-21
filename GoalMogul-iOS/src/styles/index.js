/**
 * This is a central hub that defines the global usage of certain color
 */

import { StyleSheet } from 'react-native';

export const BACKGROUND_COLOR = '#f8f8f8';
export const APP_BLUE_BRIGHT = '#17B3EC';
// export const APP_BLUE = '#34C1F1';
export const APP_BLUE = '#23B7E9';
export const APP_DEEP_BLUE = '#0397CB';

/**
 * Following is the new blue for V2 
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=1%3A626
 */
export const GM_BLUE = "#45C9F6";
export const GM_BLUE_LIGHT = "#9EE6FF";
export const GM_BLUE_LIGHT_LIGHT = "#DEF7FF";
export const GM_DOT_GRAY = "#E0E0E0";

/**
 * Standardized font size for GM V2
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=1%3A626
 */
export const GM_FONT_1 = 12;
export const GM_FONT_2 = 14;
export const GM_FONT_3 = 16;
export const GM_FONT_3_5 = 18;
export const GM_FONT_4 = 22;

export const imagePreviewContainerStyle = {
  shadowColor: '#ddd',
  shadowOffset: { width: 0, height: 1.5 },
  shadowOpacity: 0.8,
  shadowRadius: 1.2,
  elevation: 1,
};

export const cardBoxBorder = {
  borderTopWidth: 0.5,
  borderTopColor: '#eaeaea'
};

export const cardBoxShadow = {
  shadowColor: '#ddd',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.3,
  shadowRadius: 1,
  elevation: 1,
};

export const tutorial = {
  containerStyle: {
    alignItems: 'center',
  },
  subTitleTextStyle: {
    fontSize: 21,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'gotham-pro-bold',
    lineHeight: 23
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'gotham-pro',
    lineHeight: 18
  },
  imageShadow: {
    shadowColor: '#4c4c4c',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  }
};

export const modalContainerStyle = { 
  backgroundColor: 'white', 
  borderRadius: 15, 
  padding: 20,
  alignItems: 'center',
};

export const modalCancelIconContainerStyle = {
  height: 30,
  width: 30,
  backgroundColor: 'rgb(217,40,40)',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 15
};

export const modalCancelIconStyle = {
  height: 14,
  width: 14,
  tintColor: 'white'
};

export const modalHeaderBadgeShadow = {
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 1.2 },
  // shadowOpacity: 0.23,
  // shadowRadius: 4
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 5,
};
