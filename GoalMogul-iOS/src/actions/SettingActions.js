import { Actions } from 'react-native-router-flux';

import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION
} from './types';

export const openSetting = () => {
  return (dispatch) => {
    dispatch({
      type: SETTING_OPEN_SETTING
    });
    Actions.setting();
  };
};

// When setting tab bar on press
export const onTabPress = tabId => {
  return (dispatch) => {
    dispatch({
      type: SETTING_TAB_SELECTION,
      payload: tabId
    });
  };
};
