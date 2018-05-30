import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import Expo, { WebBrowser } from 'expo';

import { api as API } from '../redux/middleware/api';

import {
  SETTING_OPEN_SETTING,
  SETTING_TAB_SELECTION,
  SETTING_RESENT_EMAIL_VERIFICATION,
  SETTING_EMAIL_UPDATE_SUCCESS,
  SETTING_PHONE_UPDATE_SUCCESS,
  SETTING_PHONE_VERIFICATION_SUCCESS,
  SETTING_FRIEND_SETTING_SELECTION,
  SETTING_FRIEND_SETTING_UPDATE_SUCCESS,
  SETTING_BLOCK_FETCH_ALL,
  SETTING_BLOCK_FETCH_ALL_DONE,
  SETTING_BLOCK_BLOCK_REQUEST,
  SETTING_BLOCK_BLOCK_REQUEST_DONE,
  SETTING_BLOCK_UNBLOCK_REQUEST,
  SETTING_BLOCK_UNBLOCK_REQUEST_DONE,
  SETTING_BLOCK_REFRESH_DONE
} from './types';

const DEBUG_KEY = '[ Setting Action ]';
const BASE_ROUTE = 'secure/user/settings';

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
export const onResendEmailPress = () => (dispatch, getState) => {
  dispatch({
    type: SETTING_RESENT_EMAIL_VERIFICATION
  });
  const { token } = getState().user;
  API.post('secure/user/account/verification', { for: 'email ' }, token).then((res) => {
    console.log('resend email verification: ', res);
  })
  .catch((err) => {
    console.log('error getting email verification: ', err);
  });
};

// Update user email
export const onUpdateEmailSubmit = values => {
  return async (dispatch, getState) => {
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
    const message = await fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('update email address with response: ', res);
        if (res.success) {
          dispatch({
            type: SETTING_EMAIL_UPDATE_SUCCESS,
            payload: values.email
          });
          Actions.popTo('setting');
          return;
        }
        return res.message;
      })
      .catch((err) => {
        console.log('error updating email: ', err);
        throw new SubmissionError({
          _error: err
        });
      });

    if (message) {
      throw new SubmissionError({
        _error: message
      });
    }
  };
};

// update user phone number
export const onUpdatePhoneNumberSubmit = values => {
  return async (dispatch, getState) => {
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
    const message = await fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('update phone number successfully: ', res);
        if (res.success) {
          dispatch({
            type: SETTING_PHONE_UPDATE_SUCCESS,
            payload: values.phone
          });
          Actions.pop();
          return;
        }
        return res.message;
      })
      .catch((err) => {
        console.log('error updating phone number: ', err);
        throw new SubmissionError({
          _error: err
        });
      });
    if (message) {
      throw new SubmissionError({
        _error: message
      });
    }
  };
};

// Verify phone number
export const onVerifyPhoneNumber = (handleRedirect) => {
  return (dispatch, getState) => {
    const { token } = getState().user;
    return API
      .post('secure/user/account/verification', { for: 'phone' }, token)
      .then(async (res) => {
        console.log('verify phone number successfully: ', res);

        let returnUrl = Expo.Linking.makeUrl('/');
        addLinkingListener(handleRedirect);
        let result = await WebBrowser.openBrowserAsync(
          `https://goalmogul-web.herokuapp.com/phone-verification?returnURL=${returnUrl}`
        );
        removeLinkingListener(handleRedirect);
      })
      .catch((err) => {
        console.log('error updating phone number: ', err);
      });
    // const url = 'https://goalmogul-api-dev.herokuapp.com/api/secure/user/account/verification';
    // const headers = {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     token,
    //     for: 'phone'
    //   })
    // };
    // return fetch(url, headers)
    //   .then((res) => res.json())
    //   .then(async (res) => {
    //     console.log('verify phone number successfully: ', res);
    //
    //     let returnUrl = Expo.Linking.makeUrl('/');
    //     addLinkingListener(handleRedirect);
    //     let result = await WebBrowser.openBrowserAsync(
    //       `https://goalmogul-web.herokuapp.com/phone-verification?returnURL=${returnUrl}`
    //     );
    //     removeLinkingListener(handleRedirect);
    //
    //     /* Version 2 of using deep link */
    //     // let returnUrl = Expo.Linking.makeUrl('');
    //     // returnUrl += '/phone/verification';
    //     // console.log('return url is: ', returnUrl);
    //     // let testUrl = `https://goalmogul-web.herokuapp.com/phone-verification?returnURL=${returnUrl}`;
    //     //
    //     // Linking.canOpenURL(testUrl).then(supported => {
    //     //   if (!supported) {
    //     //     console.log('Can\'t handle url: ' + testUrl);
    //     //   } else {
    //     //     return Linking.openURL(testUrl);
    //     //   }
    //     // }).catch(err => console.error('An error occurred', err));
    //   })
    //   .catch((err) => {
    //     console.log('error updating phone number: ', err);
    //   });
  };
};

const addLinkingListener = (handleRedirect) => {
  Expo.Linking.addEventListener('url', handleRedirect);
};

const removeLinkingListener = (handleRedirect) => {
  Expo.Linking.removeEventListener('url', handleRedirect);
};

export const verifyPhoneNumberSuccess = () => {
  return {
    type: SETTING_PHONE_VERIFICATION_SUCCESS
  };
};

/* Privacy actions */

// Update privacy.friends setting selection locally
export const onFriendsSettingSelection = id => (dispatch) => {
  dispatch({
    type: SETTING_FRIEND_SETTING_SELECTION,
    payload: id
  });
};

// Update privacy.friends setting selection
export const updateFriendsSetting = () => (dispatch, getState) => {
  const { token } = getState().user;
  const { friends } = getState().setting.privacy;
  if (!friends) {
    return;
  }
  API.put('secure/user/account/privacy', { friends }, token).then((res) => {
    console.log('successfully update privacy setting: ', res);
    dispatch({
      type: SETTING_FRIEND_SETTING_UPDATE_SUCCESS
    });
  })
  .catch((err) => {
    console.log('error updating privacy setting: ', err);
  });
};

// Setting account get blocked users with skip and limit
export const getBlockedUsers = () => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_FETCH_ALL
  });
  const { token } = getState().user;
  const { skip, limit } = getState().setting.block;
  fetchBlockedUsers(skip, limit, token, (res) => {
    console.log('response for get all blocked users: ', res);
    dispatch({
      type: SETTING_BLOCK_FETCH_ALL_DONE,
      payload: {
        skip: skip + limit,
        data: []
      }
    });
  });
};

// Refresh blocked user page with skip and limit
export const refreshBlockedUsers = () => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_FETCH_ALL
  });
  const { token } = getState().user;
  const { limit } = getState().setting.block;

  fetchBlockedUsers(0, limit, token, (res) => {
    console.log(`response to refresh blocked users with limit: ${limit}: `, res);
    dispatch({
      type: SETTING_BLOCK_FETCH_ALL_DONE,
      payload: {
        skip: limit,
        data: []
      }
    });
  });
};

const fetchBlockedUsers = (skip, limit, token, callback) => {
  API
  .get(`secure/user/settings/block?skip=${skip}&limit=${limit}`, token)
  .then((res) => {
    if (callback) {
      callback(res);
    }
  })
  .catch((error) => {
    console.log('error for getting all blocked user: ', error);
  });
};

// Block one particular user with userId
export const blockUser = (userId) => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_BLOCK_REQUEST,
    payload: userId
  });
  const { token } = getState().user;
  API.post(`${BASE_ROUTE}/block`, { userId }, token).then((res) => {
    console.log(`${DEBUG_KEY}: block user with res: `, res);
    dispatch({
      type: SETTING_BLOCK_BLOCK_REQUEST_DONE,
      payload: userId
    });
  })
  .catch((err) => {
    console.log(`${DEBUG_KEY}: block user with error: `, err);
    dispatch({
      type: SETTING_BLOCK_BLOCK_REQUEST_DONE,
      payload: undefined
    });
  });
};

// Setting account unblock user
export const unblockUser = (userId) => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_UNBLOCK_REQUEST,
    payload: userId
  });
  const { token } = getState().user;
  API.delete(`${BASE_ROUTE}/block`, { userId }, token).then((res) => {
    console.log(`${DEBUG_KEY} response for deleting a blocked user: `, userId, ', is: ', res);
    dispatch({
      type: SETTING_BLOCK_UNBLOCK_REQUEST_DONE,
      payload: userId
    });
  })
  .catch((error) => {
    console.log(`${DEBUG_KEY} error for unblocking user: `, error);
  });
};
