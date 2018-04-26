import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';

import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION,
  SETTING_RESENT_EMAIL_VERIFICATION,
  SETTING_EMAIL_UPDATE_SUCCESS,
  SETTING_PHONE_UPDATE_SUCCESS,
  SETTING_FRIEND_SETTING_SELECTION,
  SETTING_FRIEND_SETTING_UPDATE_SUCCESS,
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

/* Account actions */
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

// Update user email
export const onUpdateEmailSubmit = values => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        email: values.email
      })
    };
    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('update email address successfully: ', res);
        dispatch({
          type: SETTING_EMAIL_UPDATE_SUCCESS,
          payload: values.email
        });
        Actions.pop();
      })
      .catch((err) => {
        console.log('error updating email: ', err);
        throw new SubmissionError({
          _error: err
        });
      });
  };
};

// update user phone number
export const onUpdatePhoneNumberSubmit = values => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        phone: values.phone
      })
    };
    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('update phone number successfully: ', res);
        dispatch({
          type: SETTING_PHONE_UPDATE_SUCCESS,
          payload: values.phone
        });
        Actions.pop();
      })
      .catch((err) => {
        console.log('error updating phone number: ', err);
        throw new SubmissionError({
          _error: err
        });
      });
  };
};

/* Privacy actions */

// Update privacy.friends setting selection locally
export const onFriendsSettingSelection = id => {
  return (dispatch) => {
    dispatch({
      type: SETTING_FRIEND_SETTING_SELECTION,
      payload: id
    });
  };
};

// Update privacy.friends setting selection
export const updateFriendsSetting = () => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    const { friends } = getState().setting.privacy;
    if (!friends) {
      return;
    }
    const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account/privacy';
    const headers = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        friends
      })
    };
    fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('successfully update privacy setting: ', res);
        dispatch({
          type: SETTING_FRIEND_SETTING_UPDATE_SUCCESS
        });
      })
      .catch((err) => {
        console.log('error updating privacy setting: ', err);
      });
  };
};
