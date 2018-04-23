import { Actions } from 'react-native-router-flux';

import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION,
  SETTING_RESENT_EMAIL_VERIFICATION
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

export const onResendEmailPress = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SETTING_RESENT_EMAIL_VERIFICATION
    });
    const { token } = getState().user;
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account/verification';
    const headers = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        for: 'email'
      })
    };
    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('resend email verification: ', res);
      })
      .catch((err) => {
        console.log('error getting email verification: ', err);
      });
  };
};
