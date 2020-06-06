import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import Expo, { WebBrowser, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Alert, Platform } from 'react-native';

import { api as API } from '../redux/middleware/api';
import { componentKeyByTab } from '../redux/middleware/utils';
import {
  getUserData 
} from '../redux/modules/User/Selector';

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
  SETTING_BLOCK_REFRESH_DONE,
  SETTING_NOTIFICATION_TOKEN_PUSH_SUCCESS
} from './types';

import {
  SETTING_BLOCK_PAGE_CLOSE
} from '../reducers/Setting';

import {
  SETTING_UPDATE_NOTIFICATION_PREFERENCE,
  SETTING_UPDATE_NOTIFICATION_PREFERENCE_SUCCESS,
  SETTING_UPDATE_NOTIFICATION_PREFERENCE_ERROR
} from '../redux/modules/User/Setting';
import { Logger } from '../redux/middleware/utils/Logger';
import { DropDownHolder } from '../Main/Common/Modal/DropDownModal';
import { trackWithProperties, EVENT as E } from '../monitoring/segment';

const DEBUG_KEY = '[ Setting Action ]';
const BASE_ROUTE = 'secure/user/settings';

export const openSetting = () => (dispatch, getState) => {
  const { tab } = getState().navigation;
  const componentKeyToOpen = componentKeyByTab(tab, 'setting');
  
  console.log(`${DEBUG_KEY}: componentKeyToOpen: ${componentKeyToOpen}`);
  dispatch({
    type: SETTING_OPEN_SETTING
  });
  Actions.push(`${componentKeyToOpen}`);
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
export const onResendEmailPress = (callback, userId) => (dispatch, getState) => {
  dispatch({
    type: SETTING_RESENT_EMAIL_VERIFICATION
  });
  const { token } = getState().user;
  
  const email = getUserData(getState(), userId, 'user.email');
  trackWithProperties(E.VERIFY_EMAIL_RESENT, {'UserId': userId, 'Email': email.address});
  API.post('secure/user/account/verification', { for: 'email' }, token).then((res) => {
    if (callback) {
      callback(`We\'ve resent a verification email to ${email.address}`);
    }
    console.log('resend email verification: ', res);
  })
  .catch((err) => {
    console.log('error getting email verification: ', err);
  });
};

// Update user email
export const onUpdateEmailSubmit = (values, callback) => {
  return async (dispatch, getState) => {
    const { token, userId } = getState().user;
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
    const { tab } = getState().navigation;
    const componentToPopTo = componentKeyByTab(tab, 'setting');
    const message = await fetch(url, headers)
      .then((res) => res.json())
      .then((res) => {
        console.log('update email address with response: ', res);
        if (res.success) {
          trackWithProperties(E.EMAIL_UPDATED, {'UserId': userId, 'Email': values.email});
          dispatch({
            type: SETTING_EMAIL_UPDATE_SUCCESS,
            payload: {
              email: values.email,
              userId
            }
          });
          Actions.popTo(`${componentToPopTo}`); // It was setting
          if (callback) {
            callback('Your email has been updated. We\'ll send you a verification email shortly.');
          }
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
export const onUpdatePhoneNumberSubmit = (values, callback) => {
  return async (dispatch, getState) => {
    const { token, userId } = getState().user;
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
          trackWithProperties(E.PHONE_UPDATED, {'UserId': userId, 'PhoneNo': values.phone});
          dispatch({
            type: SETTING_PHONE_UPDATE_SUCCESS,
            payload: {
              phone: values.phone,
              userId
            }
          });
          Actions.pop();
          if (callback) {
            callback();
          }
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

export const onAddVerifyPhone = (handleRedirect) => async (dispatch) => {
  const returnUrl = Expo.Linking.makeUrl('/');
  addLinkingListener(handleRedirect);
  const result = await WebBrowser.openBrowserAsync(
    `https://goalmogul-web.herokuapp.com/phone-verification?returnURL=${returnUrl}`
  );
  removeLinkingListener(handleRedirect);
};

// Verify phone number
export const onVerifyPhoneNumber = (handleRedirect) => {
  return (dispatch, getState) => {
    const { token, userId } = getState().user;
    return API
      .post('secure/user/account/verification', { for: 'phone' }, token)
      .then(async (res) => {
        console.log('verify phone number successfully: ', res);
        trackWithProperties(E.PHONE_VERIFIED, {'UserId': userId});
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

export const verifyPhoneNumberSuccess = () => (dispatch, getState) => {
  const { userId } = getState().user;
  dispatch({
    type: SETTING_PHONE_VERIFICATION_SUCCESS,
    payload: {
      userId
    }
  });
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

/**
 * Reset block page status on close
 */
export const friendsBlockedOnClose = () => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_PAGE_CLOSE
  });
};

// Setting account get blocked users with skip and limit
export const getBlockedUsers = (refresh) => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_FETCH_ALL,
    payload: {
      refresh
    }
  });
  const { token } = getState().user;
  const { skip, limit, hasNextPage } = getState().setting.block;
  const newSkip = refresh ? 0 : skip;
  if (hasNextPage === undefined || hasNextPage) {
    API
    .get(`secure/user/settings/block?skip=${newSkip}&limit=${limit}`, token)
    .then((res) => {
      console.log('response for get all blocked users: ', res);
      if (res.data !== null && res.data) {
        const { data } = res;
        dispatch({
          type: SETTING_BLOCK_FETCH_ALL_DONE,
          payload: {
            skip: newSkip + data.length,
            data,
            refresh,
            hasNextPage: data.length !== 0,
            message: undefined
          }
        });
      }
    })
    .catch((error) => {
      console.log('error for getting blocked user: ', error);
      dispatch({
        type: SETTING_BLOCK_FETCH_ALL_DONE,
        payload: {
          skip: newSkip,
          data: [],
          message: error,
          refresh,
          hasNextPage: undefined
        }
      });
    });
  }
};

// Block one particular user with userId
export const blockUser = (userId, callback) => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_BLOCK_REQUEST,
    payload: userId
  });
  const { token } = getState().user;
  trackWithProperties(E.USER_BLOCKED, {'UserId': userId});
  API.post(`${BASE_ROUTE}/block`, { blockeeId: userId }, token).then((res) => {
    console.log(`${DEBUG_KEY}: block user with res: `, res);
    if (callback) {
      callback();
    }
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
export const unblockUser = (blockId, callback) => (dispatch, getState) => {
  dispatch({
    type: SETTING_BLOCK_UNBLOCK_REQUEST,
    payload: blockId
  });
  const { token, userId } = getState().user;
  trackWithProperties(E.USER_UNBLOCKED, {'UserId': userId});
  API
    .delete(`${BASE_ROUTE}/block?blockId=${blockId}`, { blockId }, token)
    .then((res) => {
      if (res.status === 200) {
        if (callback) {
          callback();
        }
        dispatch({
          type: SETTING_BLOCK_UNBLOCK_REQUEST_DONE,
          payload: blockId
        });
        console.log(`${DEBUG_KEY} unblock user: ${blockId}, success with res: ${res}`);
        return;
      }
      console.log(`${DEBUG_KEY}: unblock user failed with res: `, res);
    })
    .catch((err) => {
      Alert.alert(
        'Unblock user failed.',
        'Please try again later'
      );
      console.log(`${DEBUG_KEY}: unblock user failed with err: `, err);
    });
};

// Push notification token to server
export const registerForPushNotificationsAsync = () => async (dispatch, getState) => {
  const { token } = getState().user;
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted' && Platform.OS == 'ios') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const notificationToken = await Notifications.getExpoPushTokenAsync();

  const onSuccess = (res) => {
    Alert.alert(
      'Success',
      'You have succesfully enabled the notification.'
    );
    console.log(`${DEBUG_KEY}: enable notification success with res: `, res);
    dispatch({
      type: SETTING_NOTIFICATION_TOKEN_PUSH_SUCCESS,
      payload: {
        notificationToken
      }
    });
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to enable notification. Please try again later.'
    );
    console.log(`${DEBUG_KEY}: error enable notification with err: `, err);
  };

  // POST the token to your backend server from
  // where you can retrieve it to send push notifications.
  return API
    .put(
      `${BASE_ROUTE}/expo-token`, { pushToken: notificationToken }, token
    )
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => {
      onError(err);
    });
};


export const saveNotificationSetting = (formValues) => (dispatch, getState) => {
  const { token, userId, user } = getState().user;
  const { emailNotiPref, pushNotiPref } = formValues;
  const prefToUpdate = {
    pushDisabled: !pushNotiPref,
    emailDisabled: !emailNotiPref
  };

  const newNotificationPreferences = { ...user.notificationPreferences, ...prefToUpdate };

  const onSuccess = (res) => {
    Logger.log(`${DEBUG_KEY}: [ saveNotificationSetting ]: update notification success`, res, 2);
    dispatch({
      type: SETTING_UPDATE_NOTIFICATION_PREFERENCE_SUCCESS,
      payload: {
        notificationPreferences: newNotificationPreferences,
        userId
      }
    });
    
    // DropDownHolder.alert('success', 'Success', 'You have updated your notification preferences');
  };

  const onError = (err) => {
    console.warn(`${DEBUG_KEY}: [ saveNotificationSetting ]: failed with err:`, err, 1);
    dispatch({
      type: SETTING_UPDATE_NOTIFICATION_PREFERENCE_ERROR,
      payload: {
        notificationPreferences: newNotificationPreferences,
        userId
      }
    });

    // DropDownHolder.alert('error', 'Error', 'Please try to update your preference later');
  };

  Logger.log(`${DEBUG_KEY}: [ saveNotificationSetting ]: new notification pref is:`, newNotificationPreferences, 2);
  // dispatch({
  //   type: SETTING_UPDATE_NOTIFICATION_PREFERENCE,
  //   payload: {
  //     notificationPreferences: newNotificationPreferences,
  //     userId
  //   }
  // });
  
  // Since we save user state at the beginning, we need to assume its sucess
  dispatch({
    type: SETTING_UPDATE_NOTIFICATION_PREFERENCE_SUCCESS,
    payload: {
      notificationPreferences: newNotificationPreferences,
      userId
    }
  });

  API
    .put(`${BASE_ROUTE}/notification-preferences`, { ...prefToUpdate }, token)
    .then(res => {
      if (res.status === 200) {
        onSuccess(res);
        return;
      }
      onError(res);
    })
    .catch(err => onError(err));
};
