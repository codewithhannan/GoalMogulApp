/**
 * This is a central hub that defines the global usage of certain color
 */

import { StyleSheet } from 'react-native';

export const BACKGROUND_COLOR = '#f8f8f8';
export const APP_BLUE_BRIGHT = '#17B3EC';
export const APP_BLUE = '#46C8F5';
export const APP_DEEP_BLUE = '#0397CB';

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
    fontFamily: 'gotham-pro-bold'
  },
  textStyle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'gotham-pro'
  },
  imageShadow: {
    shadowColor: '#4c4c4c',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 1,
  }
};
